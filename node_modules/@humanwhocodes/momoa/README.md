# Momoa JSON

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## About

Momoa is a general purpose JSON utility toolkit, containing:

* A **tokenizer** that allows you to separate a JSON string into its component parts.
* A ECMA-404 compliant **parser** that produces an abstract syntax tree (AST) representing everything inside of a JSON string.
* A **traverser** that visits an AST produced by the parser in order.
* A **printer** that can convert an AST produced by the parser back into a valid JSON string.

## Background

JavaScript defines the `JSON` object with methods for both parsing strings into objects and converting objects into JSON-formatted strings. In most cases, this is exactly what you need and should use without question. However, these methods aren't useful for more fine-grained analysis of JSON structures. For instance, you'll never know if a JSON object contains two properties with the same names because `JSON.parse()` will ignore the first one and return the value of the second. A tool like Momoa comes in handy when you want to know not just the result of JSON parsing, but exactly what is contained in the original JSON string.

## Usage

### Node.js

Install using [npm][npm] or [yarn][yarn]:

```
npm install @humanwhocodes/momoa

# or

yarn add @humanwhocodes/momoa
```

Import into your Node.js project:

```js
// CommonJS
const { parse } = require("@humanwhocodes/momoa");

// ESM
import { parse } from "@humanwhocodes/momoa";
```

### Deno

Import into your Deno project:

```js
import { parse } from "https://cdn.skypack.dev/@humanwhocodes/momoa?dts";
```

### Bun

Install using this command:

```
bun add @humanwhocodes/momoa
```

Import into your Bun project:

```js
import { parse } from "@humanwhocodes/momoa";
```

### Browser

It's recommended to import the minified version to save bandwidth:

```js
import { parse } from "https://cdn.skypack.dev/@humanwhocodes/momoa?min";
```

However, you can also import the unminified version for debugging purposes:

```js
import { parse } from "https://cdn.skypack.dev/@humanwhocodes/momoa";
```

## API

### Parsing 

To parse a JSON string into an AST, use the `parse()` function:

```js
const { parse } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);
```

The `parse()` function accepts a second argument, which is an options object that may contain one or more of the following properties:

* `mode` (default: `"json"`) - specify the parsing mode. Possible options are `"json"`, `"jsonc"` (JSON with comments), and `"json5"`.
* `ranges` (default: `false`) - set to `true` if you want each node to also have a `range` property, which is an array containing the start and stop index for the syntax within the source string.
* `tokens` - set to `true` to return a `tokens` property on the root node containing all of the tokens used to parse the code. If `mode` is `"jsonc"` or `"json5"`, then the tokens include comment tokens.
* `allowTrailingCommas` - set to `true` to allow trailing commas in arrays and objects in `"json"` and `"jsonc"` modes. This option is ignored in JSON5 mode.

Here's an example of passing options:

```js
const { parse } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string, {
    mode: "jsonc",
    ranges: true,
    tokens: true
});

// root now has a range array
console.dir(ast.range);

// root now has a tokens array
console.dir(ast.tokens);
```

### Tokenizing 

To produce JSON tokens from a string, use the `tokenize()` function:

```js
const { tokenize } = require("@humanwhocodes/momoa");
const json = "{\"foo\":\"bar\"}";

for (const token of tokenize(json)) {
    console.log("Token type is", token.type);

    const start = token.loc.start.offset;
    const end = token.loc.end.offset;
    console.log("Token value is", json.slice(start, end));
}
```

The `tokenize()` function accepts a second parameter, which is an options object that may contain one or more of the following properties:

* `mode` (default: `"json"`) - specify the parsing mode. Possible options are `"json"`, `"jsonc"` (JSON with comments), and `"json5"`.
* `ranges` (default: `false`) - set to `true` if you want each token to also have a `range` property, which is an array containing the start and stop index for the syntax within the source string.

### Traversing

There are two ways to traverse an AST: iteration and traditional traversal.

#### Iterating

Iteration uses a generator function to create an iterator over the AST:

```js
const { parse, iterator } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);

for (const { node, parent, phase } of iterator(ast)) {
    console.log(node.type);
    console.log(phase); // "enter" or "exit"
}
```

Each step of the iterator returns an object with three properties:

1. `node` - the node that the traversal is currently visiting
1. `parent` - the parent node of `node`
1. `phase` - a string indicating the phase of traversal (`"enter"` when first visiting the node, `"exit"` when leaving the node)

You can also filter the iterator by passing in a filter function. For instance, if you only want steps to be returned in the `"enter"` phase, you can do this:

```js
const { parse, iterator } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);

for (const { node } of iterator(ast, ({ phase }) => phase === "enter")) {
    console.log(node.type);
}
```

#### Traversing

Traversing uses a function that accepts an object with `enter` and `exit` properties:

```js
const { parse, traverse } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);

traverse(ast, {
    enter(node, parent) {
        console.log("Entering", node.type);
    },
    exit(node, parent) {
        console.log("Exiting", node.type);
    }
});
```

## Evaluating

To convert an AST into the JavaScript value it represents, use the `evaluate()` function:

```js
const { parse, evaluate } = require("@humanwhocodes/momoa");

// same as JSON.parse(some_json_string)
const ast = parse(some_json_string);
const value = evaluate(ast);
```

In this example, `value` is the same result you would get from calling `JSON.parse(some_json_string)` (`ast` is the intermediate format representing the syntax).

### Printing

To convert an AST back into a JSON string, use the `print()` function:

```js
const { parse, print } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);
const text = print(ast);
```

**Note:** The printed AST will not produce the same result as the original JSON text as the AST does not preserve whitespace.

You can modify the output of the `print()` function by passing in an object with an `indent` option specifying the number of spaces to use for indentation. When the `indent` option is passed, the text produced will automatically have newlines insert after each `{`, `}`, `[`, `]`, and `,` characters.

```js
const { parse, print } = require("@humanwhocodes/momoa");

const ast = parse(some_json_string);
const text = print(ast, { indent: 4 });
```

### Visitor Keys

Momoa also exports a map of traversable properties in AST nodes that is helpful if you'd like to traverse an AST manually. This is a map where the keys are the `type` property of each AST node and the values are an array of property names to traverse.

```js
const { visitorKeys } = require("@humanwhocodes/momoa");

console.log(visitorKeys.get("Document")); // "body"
```

## Development

To work on Momoa, you'll need:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org)

Make sure both are installed by visiting the links and following the instructions to install.

Now you're ready to clone the repository:

```bash
git clone https://github.com/humanwhocodes/momoa.git
```

Then, enter the directory and install the dependencies:

```bash
cd momoa/js
npm install
```

After that, you can run the tests via:

```bash
npm test
```

**Note:** Momoa builds itself into a single file for deployment. The `npm test` command automatically rebuilds Momoa into that single file whenever it is run. If you are testing in a different way, then you may need to manually rebuild using the `npm run build` command.

## Acknowledgements

This project takes inspiration (but not code) from a number of other projects:

* [`Esprima`](https://esprima.org) inspired the package interface and AST format.
* [`json-to-ast`](https://github.com/vtrushin/json-to-ast) inspired the AST format.
* [`parseJson.js`](https://gist.github.com/rgrove/5cc64db4b9ae8c946401b230ba9d2451) inspired me by showing writing a parser isn't all that hard.

## License

Apache 2.0

## Frequently Asked Questions

### What does "Momoa" even mean?

Momoa is the last name of American actor [Jason Momoa](https://en.wikipedia.org/wiki/Jason_Momoa). Because "JSON" is pronounced "Jason", I wanted a name that played off of this fact. The most obvious choice would have been something related to [Jason and the Argonauts](https://en.wikipedia.org/wiki/Jason_and_the_Argonauts_(1963_film)), as this movie is referenced in the [JSON specification](https://ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf) directly. However, both "Argo" and "Argonaut" were already used for open source projects. When I did a search for "Jason" online, Jason Momoa was the first result that came up. He always plays badass characters so it seemed to fit.

### Why support comments in JSON?

There are a number of programs that allow C-style comments in JSON files, most notably, configuration files for [Visual Studio Code](https://code.visualstudio.com). As there seems to be a need for this functionality, I decided to add it out-of-the-box.

[npm]: https://npmjs.com/
[yarn]: https://yarnpkg.com/
