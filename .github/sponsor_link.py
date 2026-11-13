#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Check that the sponsor link of the readme still redirects to the agreed URL.

The sponsor serves `SPONSOR_LINK` from their own server, so they can change where
it sends readers at any time. This script requests the link as several clients,
without following the redirect, and compares the answer with `EXPECTED_LOCATION`.

Each check writes one JSON record to the `LOG_BRANCH` branch. A record is written
once and never changed, so the branch history keeps a dated trail of every answer,
the days the link behaved included. When the link stops redirecting as agreed, the
script opens an issue, then comments on it each time the answer changes.

Run it with `--dry-run` to probe the link and print the record without writing to
GitHub.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import http.client
import json
import os
import re
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import quote, urljoin, urlsplit

TYPE_CHECKING = False
if TYPE_CHECKING:
    from typing import Any

# The link `readme.md` carries, served by the sponsor's own redirect server.
SPONSOR_LINK = "https://go.nli.one/billing"

# The target `SPONSOR_LINK` redirected to on 2026-11-13, the day the sponsorship
# started.
EXPECTED_LOCATION = (
    "https://whop.com/start/?code=BILLING&utm_source=majoragv"
    "&utm_medium=sponsor&utm_campaign=billing"
)

README_PATH = Path("readme.md")

LOG_BRANCH = "sponsor-link-log"

LOG_BRANCH_README = f"""\
# Sponsor link log

This branch holds one JSON record per check of {SPONSOR_LINK}, the sponsor link of
`readme.md` on `main`. The `.github/workflows/sponsor-link.yaml` workflow on `main`
writes the records. It writes each record once and never changes it.

Do not merge this branch.
"""

ISSUE_MARKER = "<!-- sponsor-link-monitor -->"

ISSUE_TITLE = "Sponsor link `go.nli.one/billing` stopped redirecting as agreed"

FINGERPRINT_MARKER = "<!-- sponsor-link-fingerprint: {} -->"

FINGERPRINT_PATTERN = re.compile(r"<!-- sponsor-link-fingerprint: ([0-9a-f]+) -->")

MONITOR_USER_AGENT = (
    "awesome-billing-sponsor-link-monitor/1"
    " (+https://github.com/kdeldycke/awesome-billing)"
)

DESKTOP_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    " (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
)

MOBILE_USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X)"
    " AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6"
    " Mobile/15E148 Safari/604.1"
)

REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})

AGREED = "as-agreed"
CHANGED_TARGET = "changed-target"
NO_REDIRECT = "no-redirect"
SERVER_ERROR = "server-error"
NETWORK_ERROR = "network-error"

# Outcomes that prove the link no longer sends readers to the agreed URL.
CHANGED_OUTCOMES = frozenset({CHANGED_TARGET, NO_REDIRECT})

# Outcomes where the sponsor's server gave no usable answer.
UNREACHABLE_OUTCOMES = frozenset({SERVER_ERROR, NETWORK_ERROR})

MAX_HOPS = 10
ATTEMPTS = 3
RETRY_DELAY_SECONDS = 30
TIMEOUT_SECONDS = 20
BODY_LIMIT_BYTES = 1024 * 1024


@dataclass(frozen=True)
class Client:
    """A kind of visitor the sponsor's server could answer differently."""

    label: str
    """The name the reports use."""

    headers: tuple[tuple[str, str], ...]
    """The request headers this client sends."""


# Browsers that arrive from the readme, and this script under its own name. A
# server that answers one of them differently is cloaking.
CLIENTS = (
    Client(
        "desktop browser",
        (
            ("User-Agent", DESKTOP_USER_AGENT),
            ("Accept", "text/html,application/xhtml+xml,*/*;q=0.8"),
            ("Accept-Language", "en-US,en;q=0.9"),
            ("Referer", "https://github.com/kdeldycke/awesome-billing"),
        ),
    ),
    Client(
        "mobile browser",
        (
            ("User-Agent", MOBILE_USER_AGENT),
            ("Accept", "text/html,application/xhtml+xml,*/*;q=0.8"),
            ("Accept-Language", "fr-FR,fr;q=0.9,en;q=0.8"),
            ("Referer", "https://github.com/"),
        ),
    ),
    Client(
        "monitor",
        (("User-Agent", MONITOR_USER_AGENT), ("Accept", "*/*")),
    ),
)


class KeepResponses(urllib.request.HTTPErrorProcessor):
    """Hand every response back as is, so no redirect is followed."""

    def http_response(
        self, request: urllib.request.Request, response: http.client.HTTPResponse
    ) -> http.client.HTTPResponse:
        return response

    https_response = http_response


PROBE_OPENER = urllib.request.build_opener(KeepResponses)


def recorded_headers(headers: http.client.HTTPMessage) -> list[list[str]]:
    """Return the response headers, with each cookie value redacted."""
    pairs = []
    for name, value in headers.items():
        if name.lower() == "set-cookie":
            value = re.sub(r"^([^=;]+)=[^;]*", r"\1=<redacted>", value)
        pairs.append([name, value])
    return pairs


def describe_body(body: bytes, content_type: str) -> dict[str, Any]:
    """Return what identifies a page, without storing the page itself."""
    title = re.search(rb"<title[^>]*>(.*?)</title>", body, re.IGNORECASE | re.DOTALL)
    return {
        "content_type": content_type,
        "bytes_read": len(body),
        "sha256": hashlib.sha256(body).hexdigest(),
        "title": title.group(1).decode("UTF-8", "replace").strip() if title else None,
    }


def fetch(url: str, client: Client) -> dict[str, Any]:
    """Request `url` once as `client`, and describe the answer."""
    request = urllib.request.Request(url, headers=dict(client.headers))
    started = time.monotonic()
    with PROBE_OPENER.open(request, timeout=TIMEOUT_SECONDS) as response:
        hop: dict[str, Any] = {
            "url": url,
            "status": response.status,
            "reason": response.reason,
            "headers": recorded_headers(response.headers),
        }
        location = response.headers.get("Location")
        if location is not None:
            hop["location"] = urljoin(url, location)
        if response.status not in REDIRECT_STATUSES:
            body = response.read(BODY_LIMIT_BYTES)
            hop["body"] = describe_body(body, response.headers.get_content_type())
    hop["elapsed_ms"] = round((time.monotonic() - started) * 1000)
    return hop


def follow(client: Client) -> list[dict[str, Any]]:
    """Return the redirect chain `client` gets from `SPONSOR_LINK`.

    The chain stops at the agreed URL: the check is about the sponsor's server,
    and Whop's own bot protection must not raise a false alarm. Any other target
    is followed, so the record shows where readers would land.

    :raises OSError: when the sponsor's server gives no answer.
    """
    hops = [fetch(SPONSOR_LINK, client)]
    while (
        len(hops) < MAX_HOPS
        and hops[-1]["status"] in REDIRECT_STATUSES
        and hops[-1].get("location") not in (None, EXPECTED_LOCATION)
        and urlsplit(hops[-1]["location"]).scheme in ("http", "https")
    ):
        target = hops[-1]["location"]
        try:
            hops.append(fetch(target, client))
        except (OSError, http.client.HTTPException) as error:
            hops.append({"url": target, "error": f"{type(error).__name__}: {error}"})
            break
    return hops


def classify(first_hop: dict[str, Any]) -> str:
    """Name what the first answer of the sponsor's server means."""
    status = first_hop["status"]
    if status in REDIRECT_STATUSES:
        if first_hop.get("location") == EXPECTED_LOCATION:
            return AGREED
        return CHANGED_TARGET
    if status >= 500:
        return SERVER_ERROR
    return NO_REDIRECT


def probe(client: Client) -> dict[str, Any]:
    """Check the link as `client`, retrying when the server gives no answer."""
    errors: list[str] = []
    hops: list[dict[str, Any]] = []
    outcome = NETWORK_ERROR
    for attempt in range(1, ATTEMPTS + 1):
        if attempt > 1:
            time.sleep(RETRY_DELAY_SECONDS)
        try:
            hops = follow(client)
        except (OSError, http.client.HTTPException) as error:
            errors.append(f"{type(error).__name__}: {error}")
            continue
        outcome = classify(hops[0])
        if outcome != SERVER_ERROR:
            break
        errors.append(f"HTTP {hops[0]['status']}")
    return {
        "client": client.label,
        "request_headers": [list(pair) for pair in client.headers],
        "outcome": outcome,
        "attempts": attempt,
        "errors": errors,
        "hops": hops,
    }


def resolve(host: str) -> dict[str, Any]:
    """Return the addresses `host` resolves to."""
    try:
        infos = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    except OSError as error:
        return {"host": host, "error": f"{type(error).__name__}: {error}"}
    return {"host": host, "addresses": sorted({str(info[4][0]) for info in infos})}


def certificate(host: str) -> dict[str, Any]:
    """Return the identity of the TLS certificate `host` presents."""
    context = ssl.create_default_context()
    try:
        with (
            socket.create_connection((host, 443), timeout=TIMEOUT_SECONDS) as sock,
            context.wrap_socket(sock, server_hostname=host) as tls,
        ):
            parsed: dict[str, Any] = dict(tls.getpeercert() or {})
            der = tls.getpeercert(binary_form=True)
            version = tls.version()
    except OSError as error:
        return {"host": host, "error": f"{type(error).__name__}: {error}"}
    return {
        "host": host,
        "tls_version": version,
        "sha256": hashlib.sha256(der).hexdigest() if der else None,
        "subject": {k: v for rdn in parsed.get("subject", ()) for k, v in rdn},
        "issuer": {k: v for rdn in parsed.get("issuer", ()) for k, v in rdn},
        "not_before": parsed.get("notBefore"),
        "not_after": parsed.get("notAfter"),
        "serial_number": parsed.get("serialNumber"),
        "subject_alt_names": [v for _kind, v in parsed.get("subjectAltName", ())],
    }


def verdict_of(probes: list[dict[str, Any]]) -> str:
    """Reduce the outcomes of every client to one verdict."""
    outcomes = {probe["outcome"] for probe in probes}
    if outcomes & CHANGED_OUTCOMES:
        return "changed"
    if outcomes & UNREACHABLE_OUTCOMES:
        return "unreachable"
    return "ok"


def fingerprint_of(probes: list[dict[str, Any]]) -> str:
    """Hash what each client got, leaving out the parts that vary every run."""
    summary = [
        [
            probe["client"],
            probe["outcome"],
            [[hop.get("status"), hop.get("location")] for hop in probe["hops"]],
        ]
        for probe in probes
    ]
    digest = hashlib.sha256(json.dumps(summary).encode("UTF-8"))
    return digest.hexdigest()[:16]


def run_context() -> dict[str, Any]:
    """Return what ties a record to its workflow run and runner."""
    env = os.environ
    server = env.get("GITHUB_SERVER_URL", "https://github.com")
    repository = env.get("GITHUB_REPOSITORY")
    run_id = env.get("GITHUB_RUN_ID")
    return {
        "repository": repository,
        "sha": env.get("GITHUB_SHA"),
        "event": env.get("GITHUB_EVENT_NAME"),
        "workflow_ref": env.get("GITHUB_WORKFLOW_REF"),
        "run_id": run_id,
        "run_attempt": env.get("GITHUB_RUN_ATTEMPT"),
        "run_url": (
            f"{server}/{repository}/actions/runs/{run_id}"
            if repository and run_id
            else None
        ),
        "runner_os": env.get("RUNNER_OS"),
        "runner_arch": env.get("RUNNER_ARCH"),
        "runner_image": env.get("ImageOS"),
        "runner_image_version": env.get("ImageVersion"),
    }


def build_record() -> dict[str, Any]:
    """Probe the link as every client and collect the evidence."""
    host = urlsplit(SPONSOR_LINK).hostname or ""
    checked_at = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    probes = [probe(client) for client in CLIENTS]
    return {
        "schema": 1,
        "checked_at": checked_at,
        "link": SPONSOR_LINK,
        "expected_location": EXPECTED_LOCATION,
        "verdict": verdict_of(probes),
        "fingerprint": fingerprint_of(probes),
        "github": run_context(),
        "dns": resolve(host),
        "tls": certificate(host),
        "probes": probes,
    }


def code(text: object) -> str:
    """Quote `text` for a Markdown table cell, so no URL in it turns into a link."""
    cleaned = str(text).replace("`", "%60").replace("|", "%7C")
    return f"`{cleaned}`"


def first_answer(probe: dict[str, Any]) -> str:
    """Describe the first answer one client got, for a table cell."""
    if not probe["hops"]:
        return code(probe["errors"][-1]) if probe["errors"] else "no answer"
    first = probe["hops"][0]
    answer = code(first["status"])
    if "location" in first:
        answer += f" to {code(first['location'])}"
    elif "body" in first:
        answer += f", page titled {code(first['body']['title'])}"
    if len(probe["hops"]) > 1:
        last = probe["hops"][-1]
        answer += f", lands on {code(last.get('url'))} after {len(probe['hops'])} hops"
        if "body" in last:
            answer += f", page titled {code(last['body']['title'])}"
        elif "error" in last:
            answer += f", which failed with {code(last['error'])}"
    return answer


def render_report(record: dict[str, Any], record_url: str | None) -> str:
    """Return the Markdown summary of one check."""
    headline = (
        f"Check of {code(record['link'])} at {code(record['checked_at'])}:"
        f" verdict {code(record['verdict'])}."
    )
    lines = [
        headline,
        "",
        f"Agreed target: {code(record['expected_location'])}",
        "",
        "| Client | Outcome | First answer |",
        "| :-- | :-- | :-- |",
    ]
    lines.extend(
        f"| {probe['client']} | {code(probe['outcome'])} | {first_answer(probe)} |"
        for probe in record["probes"]
    )
    dns, tls = record["dns"], record["tls"]
    lines.append("")
    if "addresses" in dns:
        addresses = ", ".join(code(address) for address in dns["addresses"])
        lines.append(f"- {code(dns['host'])} resolves to {addresses}.")
    else:
        lines.append(
            f"- DNS lookup of {code(dns['host'])} failed: {code(dns['error'])}"
        )
    if "sha256" in tls:
        lines.append(
            f"- TLS certificate {code(tls['sha256'])}, issued by"
            f" {code(tls['issuer'].get('organizationName'))}, valid until"
            f" {code(tls['not_after'])}."
        )
    else:
        lines.append(f"- TLS handshake failed: {code(tls['error'])}")
    if record["github"]["run_url"]:
        lines.append(f"- Run: {record['github']['run_url']}")
    if record_url:
        lines.append(f"- Record: {record_url}")
    return "\n".join(lines) + "\n"


@dataclass(frozen=True)
class GitHub:
    """The few REST API calls the monitor needs, made with the workflow token."""

    token: str
    repository: str
    api_url: str
    server_url: str

    @classmethod
    def from_environment(cls) -> GitHub:
        """Read the token and the repository from the workflow environment."""
        return cls(
            token=os.environ["GITHUB_TOKEN"],
            repository=os.environ["GITHUB_REPOSITORY"],
            api_url=os.environ.get("GITHUB_API_URL", "https://api.github.com"),
            server_url=os.environ.get("GITHUB_SERVER_URL", "https://github.com"),
        )

    def call(
        self, method: str, path: str, payload: dict[str, Any] | None = None
    ) -> Any:
        """Send one request to the repository's API and decode the answer."""
        request = urllib.request.Request(
            f"{self.api_url}/repos/{self.repository}{path}",
            data=None if payload is None else json.dumps(payload).encode("UTF-8"),
            method=method,
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {self.token}",
                "User-Agent": MONITOR_USER_AGENT,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = response.read()
        return json.loads(body) if body else None

    def ensure_log_branch(self) -> None:
        """Create `LOG_BRANCH` as an orphan branch when it does not exist yet."""
        try:
            self.call("GET", f"/branches/{quote(LOG_BRANCH, safe='')}")
        except urllib.error.HTTPError as error:
            if error.code != 404:
                raise
        else:
            return
        tree = self.call(
            "POST",
            "/git/trees",
            {
                "tree": [
                    {
                        "path": "readme.md",
                        "mode": "100644",
                        "type": "blob",
                        "content": LOG_BRANCH_README,
                    }
                ]
            },
        )
        commit = self.call(
            "POST",
            "/git/commits",
            {
                "message": "Start the sponsor link log",
                "tree": tree["sha"],
                "parents": [],
            },
        )
        self.call(
            "POST",
            "/git/refs",
            {"ref": f"refs/heads/{LOG_BRANCH}", "sha": commit["sha"]},
        )

    def write_record(self, record: dict[str, Any]) -> str:
        """Commit `record` as a new file on `LOG_BRANCH`, and return its URL."""
        self.ensure_log_branch()
        stamp = record["checked_at"].replace(":", "")
        path = f"records/{stamp[:4]}/{stamp}.json"
        content = json.dumps(record, indent=2, ensure_ascii=False) + "\n"
        result = self.call(
            "PUT",
            f"/contents/{path}",
            {
                "message": f"Record `{record['verdict']}` check of `{SPONSOR_LINK}`",
                "content": base64.b64encode(content.encode("UTF-8")).decode("ascii"),
                "branch": LOG_BRANCH,
            },
        )
        return str(result["content"]["html_url"])

    def find_open_issue(self) -> dict[str, Any] | None:
        """Return the open issue this monitor opened, if any."""
        for page in range(1, 11):
            issues = self.call("GET", f"/issues?state=open&per_page=100&page={page}")
            for issue in issues:
                if "pull_request" not in issue and ISSUE_MARKER in (
                    issue.get("body") or ""
                ):
                    return dict(issue)
            if len(issues) < 100:
                break
        return None

    def last_fingerprint(self, issue: dict[str, Any]) -> str | None:
        """Return the fingerprint the issue thread reported last."""
        texts = [issue.get("body") or ""]
        for page in range(1, 11):
            comments = self.call(
                "GET", f"/issues/{issue['number']}/comments?per_page=100&page={page}"
            )
            texts.extend(comment.get("body") or "" for comment in comments)
            if len(comments) < 100:
                break
        found = FINGERPRINT_PATTERN.findall("\n".join(texts))
        return found[-1] if found else None

    def report(self, record: dict[str, Any], record_url: str | None) -> str | None:
        """Open or update the issue, and return its URL when this run wrote to it."""
        issue = self.find_open_issue()
        verdict = record["verdict"]
        if issue is None and verdict == "ok":
            return None
        report = render_report(record, record_url)
        marker = FINGERPRINT_MARKER.format(record["fingerprint"])
        if issue is None:
            history = f"{self.server_url}/{self.repository}/commits/{LOG_BRANCH}"
            body = (
                f"{ISSUE_MARKER}\nThe sponsor link in `readme.md` stopped"
                f" redirecting to the agreed URL. Verdict: `{verdict}`.\n\n"
                f"{report}\n"
                f"The `{LOG_BRANCH}` branch holds the record of every check,"
                f" the days the link behaved included: {history}\n\n"
                "To stop sending readers through the sponsor's server, link the"
                " agreed target in `readme.md` directly.\n\n"
                f"{marker}\n"
            )
            created = self.call("POST", "/issues", {"title": ISSUE_TITLE, "body": body})
            return str(created["html_url"])
        if self.last_fingerprint(issue) == record["fingerprint"]:
            return None
        intro = (
            "The link redirects to the agreed URL again."
            if verdict == "ok"
            else f"The link answers differently. Verdict: `{verdict}`."
        )
        comment = self.call(
            "POST",
            f"/issues/{issue['number']}/comments",
            {"body": f"{intro}\n\n{report}\n{marker}\n"},
        )
        return str(comment["html_url"])


def write_step_summary(text: str) -> None:
    """Append `text` to the job summary when running in GitHub Actions."""
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with Path(summary_path).open("a", encoding="UTF-8") as summary:
            summary.write(text + "\n")


def main() -> int:
    """Check the link, record the answer, and report a broken agreement."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Probe the link and print the record, without writing to GitHub.",
    )
    args = parser.parse_args()

    if SPONSOR_LINK not in README_PATH.read_text(encoding="UTF-8"):
        print(f"{README_PATH} no longer links {SPONSOR_LINK}: nothing to check.")
        return 0

    record = build_record()
    if args.dry_run:
        print(json.dumps(record, indent=2, ensure_ascii=False))
        print(render_report(record, None))
        return 0 if record["verdict"] == "ok" else 1

    failures = []
    record_url = None
    github = GitHub.from_environment()
    try:
        record_url = github.write_record(record)
    except (OSError, KeyError, ValueError) as error:
        failures.append(f"Writing the record to {LOG_BRANCH} failed: {error}")
    issue_url = None
    try:
        issue_url = github.report(record, record_url)
    except (OSError, KeyError, ValueError) as error:
        failures.append(f"Updating the issue failed: {error}")

    report = render_report(record, record_url)
    if issue_url:
        report += f"- Issue: {issue_url}\n"
    print(report)
    write_step_summary(report)
    if record["verdict"] != "ok":
        print(
            f"::error title=Sponsor link {record['verdict']}::{SPONSOR_LINK} no longer"
            f" redirects to {EXPECTED_LOCATION}"
        )
    for failure in failures:
        print(f"::error title=Sponsor link monitor::{failure}")
    return 0 if record["verdict"] == "ok" and not failures else 1


if __name__ == "__main__":
    sys.exit(main())
