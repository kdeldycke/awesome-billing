/**
 * @fileoverview Type definitions for the Momoa JSON parser.
 * @author Nicholas C. Zakas
 */
/**
 * The mode that Momoa runs in:
 * - "json" for regular JSON
 * - "jsonc" for JSON with C-style comments
 */
export type Mode = "json" | "jsonc" | "json5";
/**
 * The phase of the traversal step.
 */
export type TraversalPhase = "enter" | "exit";
/**
 * The type of a JSON5 Infinity or NaN value.
 * - "+" for positive Infinity or postive NaN
 * - "-" for negative Infinity or negative NaN
 * - "" for Infinity or NaN without a sign
 */
export type Sign = "+" | "-" | "";
/**
 * Tokenization options.
 */
export interface TokenizeOptions {
    /**
     * The mode to tokenize in.
     */
    readonly mode?: Mode;
    /**
     * When true, includes the `range` key on each token.
     */
    readonly ranges?: boolean;
}
/**
 * Parse options.
 */
export interface ParseOptions {
    /**
     * The mode to parse in.
     */
    readonly mode?: Mode;
    /**
     * When true, includes the `range` key on each node and token.
     */
    readonly ranges?: boolean;
    /**
     * When true, includes the `tokens` key on the document node containing
     * all of the tokens used during parsing.
     */
    readonly tokens?: boolean;
    /**
     * When true, allows trailing commas in arrays and objects. Defaults to
     * false for JSON and JSONC modes, and true for JSON5 mode.
     */
    readonly allowTrailingCommas?: boolean;
}
export interface Node {
    type: string;
    loc: LocationRange;
    range?: Range;
}
/**
 * The root node of a JSON document.
 */
export interface DocumentNode extends Node {
    type: "Document";
    body: ValueNode;
    tokens?: Array<Token>;
}
export interface NullNode extends Node {
    type: "Null";
}
interface LiteralNode<T> extends Node {
    value: T;
}
/**
 * Represents a JSON5 NaN value.
 */
export interface NaNNode extends Node {
    type: "NaN";
    sign: Sign;
}
/**
 * Represents a JSON5 Infinity value.
 */
export interface InfinityNode extends Node {
    type: "Infinity";
    sign: Sign;
}
/**
 * Represents a JSON identifier.
 */
export interface IdentifierNode extends Node {
    type: "Identifier";
    name: string;
}
/**
 * Represents a JSON string.
 */
export interface StringNode extends LiteralNode<string> {
    type: "String";
}
/**
 * Represents a JSON number.
 */
export interface NumberNode extends LiteralNode<number> {
    type: "Number";
}
/**
 * Represents a JSON boolean.
 */
export interface BooleanNode extends LiteralNode<boolean> {
    type: "Boolean";
}
/**
 * Represents an element of a JSON array.
 */
export interface ElementNode extends Node {
    type: "Element";
    value: ValueNode;
}
/**
 * Represents a JSON array.
 */
export interface ArrayNode extends Node {
    type: "Array";
    elements: Array<ElementNode>;
}
/**
 * Represents a member of a JSON object.
 */
export interface MemberNode extends Node {
    type: "Member";
    name: StringNode | IdentifierNode;
    value: ValueNode;
}
/**
 * Represents a JSON object.
 */
export interface ObjectNode extends Node {
    type: "Object";
    members: Array<MemberNode>;
}
/**
 * Any node that represents a JSON value.
 */
export type ValueNode = ArrayNode | ObjectNode | BooleanNode | StringNode | NumberNode | NullNode | NaNNode | InfinityNode;
/**
 * Any node that represents the container for a JSON value.
 */
export type ContainerNode = DocumentNode | MemberNode | ElementNode;
/**
 * Any node that represents a JSON5 extension.
 */
export type JSON5ExtensionNode = NaNNode | InfinityNode | IdentifierNode;
/**
 * Any valid AST node.
 */
export type AnyNode = ValueNode | ContainerNode | JSON5ExtensionNode;
/**
 * Additional information about an AST node.
 */
export interface NodeParts {
    loc?: LocationRange;
    range?: Range;
}
/**
 * Values that can be represented in JSON.
 */
export type JSONValue = Array<JSONValue> | boolean | number | string | {
    [property: string]: JSONValue;
} | null;
/**
 * A token used to during JSON parsing.
 */
export interface Token {
    type: TokenType;
    loc: LocationRange;
    range?: Range;
}
/**
 * The type of token.
 */
export type TokenType = "Number" | "String" | "Boolean" | "Colon" | "LBrace" | "RBrace" | "RBracket" | "LBracket" | "Comma" | "Null" | "LineComment" | "BlockComment" | "NaN" | "Infinity" | "Identifier";
/**
 * The start and stop location for a token or node inside the source text.
 */
export interface LocationRange {
    start: Location;
    end: Location;
}
/**
 * A cursor location inside the source text.
 */
export interface Location {
    line: number;
    column: number;
    offset: number;
}
/**
 * The start and stop offset for a given node or token inside the source text.
 */
export type Range = [number, number];
export {};
