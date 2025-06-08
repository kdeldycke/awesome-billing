export type FilterPredicate = (item: {
    node: Node;
    parent?: Node;
    phase: TraversalPhase;
}, index: number, array: Array<{
    node: Node;
    parent?: Node;
    phase: TraversalPhase;
}>) => boolean;
export type AnyNode = import("./typedefs.cjs").AnyNode;
export type JSONValue = import("./typedefs.cjs").JSONValue;
export type TokenType = import("./typedefs.cjs").TokenType;
export type Location = import("./typedefs.cjs").Location;
export type Token = import("./typedefs.cjs").Token;
export type Range = import("./typedefs.cjs").Range;
export type TokenizeOptions = import("./typedefs.cjs").TokenizeOptions;
export type NodeParts = import("./typedefs.cjs").NodeParts;
export type DocumentNode = import("./typedefs.cjs").DocumentNode;
export type StringNode = import("./typedefs.cjs").StringNode;
export type NumberNode = import("./typedefs.cjs").NumberNode;
export type BooleanNode = import("./typedefs.cjs").BooleanNode;
export type MemberNode = import("./typedefs.cjs").MemberNode;
export type ObjectNode = import("./typedefs.cjs").ObjectNode;
export type ElementNode = import("./typedefs.cjs").ElementNode;
export type ArrayNode = import("./typedefs.cjs").ArrayNode;
export type NullNode = import("./typedefs.cjs").NullNode;
export type ValueNode = import("./typedefs.cjs").ValueNode;
export type IdentifierNode = import("./typedefs.cjs").IdentifierNode;
export type NaNNode = import("./typedefs.cjs").NaNNode;
export type InfinityNode = import("./typedefs.cjs").InfinityNode;
export type Sign = import("./typedefs.cjs").Sign;
export type Node = import("./typedefs.cjs").Node;
export type Mode = import("./typedefs.cjs").Mode;
export type ParseOptions = import("./typedefs.cjs").ParseOptions;
export type TraversalPhase = import("./typedefs.cjs").TraversalPhase;
export type TraversalVisitor = {
    enter?: (node: Node, parent?: Node) => void;
    exit?: (node: Node, parent?: Node) => void;
};
/**
 * @fileoverview Evaluator for Momoa AST.
 * @author Nicholas C. Zakas
 */
/** @typedef {import("./typedefs.cjs").AnyNode} AnyNode */
/** @typedef {import("./typedefs.cjs").JSONValue} JSONValue */
/**
 * Evaluates a Momoa AST node into a JavaScript value.
 * @param {AnyNode} node The node to interpet.
 * @returns {JSONValue} The JavaScript value for the node.
 */
export function evaluate(node: AnyNode): JSONValue;
/**
 * @callback FilterPredicate
 * @param {{node: Node, parent?: Node, phase: TraversalPhase}} item
 * @param {number} index
 * @param {Array<{node: Node, parent?: Node, phase: TraversalPhase}>} array
 * @returns {boolean}
 */
/**
 * Creates an iterator over the given AST.
 * @param {Node} root The root AST node to traverse.
 * @param {FilterPredicate} [filter] A filter function to determine which steps to
 *      return;
 * @returns {IterableIterator<{node: Node, parent?: Node, phase: TraversalPhase}>} An iterator over the AST.
 */
export function iterator(root: Node, filter?: FilterPredicate): IterableIterator<{
    node: Node;
    parent?: Node;
    phase: TraversalPhase;
}>;
/**
 *
 * @param {string} text The text to parse.
 * @param {ParseOptions} [options] The options object.
 * @returns {DocumentNode} The AST representing the parsed JSON.
 * @throws {Error} When there is a parsing error.
 */
export function parse(text: string, options?: ParseOptions): DocumentNode;
/**
 * Converts a Momoa AST back into a JSON string.
 * @param {AnyNode} node The node to print.
 * @param {Object} options Options for the print.
 * @param {number} [options.indent=0] The number of spaces to indent each line. If
 *      greater than 0, then newlines and indents will be added to output.
 * @returns {string} The JSON representation of the AST.
 */
export function print(node: AnyNode, { indent }?: {
    indent?: number;
}): string;
/**
 * Creates an iterator over the tokens representing the source text.
 * @param {string} text The source text to tokenize.
 * @param {TokenizeOptions} [options] Options for doing the tokenization.
 * @returns {Array<Token>} An iterator over the tokens.
 */
export function tokenize(text: string, options?: TokenizeOptions): Array<Token>;
/**
 * Traverses an AST from the given node.
 * @param {Node} root The node to traverse from
 * @param {TraversalVisitor} visitor An object with an `enter` and `exit` method.
 */
export function traverse(root: Node, visitor: TraversalVisitor): void;
export namespace types {
    /**
     * Creates a document node.
     * @param {ValueNode} body The body of the document.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {DocumentNode} The document node.
     */
    export function document(body: ValueNode, parts?: NodeParts): DocumentNode;
    /**
     * Creates a string node.
     * @param {string} value The value for the string.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {StringNode} The string node.
     */
    export function string(value: string, parts?: NodeParts): StringNode;
    /**
     * Creates a number node.
     * @param {number} value The value for the number.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {NumberNode} The number node.
     */
    export function number(value: number, parts?: NodeParts): NumberNode;
    /**
     * Creates a boolean node.
     * @param {boolean} value The value for the boolean.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {BooleanNode} The boolean node.
     */
    export function boolean(value: boolean, parts?: NodeParts): BooleanNode;
    /**
     * Creates a null node.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {NullNode} The null node.
     */
    function _null(parts?: NodeParts): NullNode;
    export { _null as null };
    /**
     * Creates an array node.
     * @param {Array<ElementNode>} elements The elements to add.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {ArrayNode} The array node.
     */
    export function array(elements: Array<ElementNode>, parts?: NodeParts): ArrayNode;
    /**
     * Creates an element node.
     * @param {ValueNode} value The value for the element.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {ElementNode} The element node.
     */
    export function element(value: ValueNode, parts?: NodeParts): ElementNode;
    /**
     * Creates an object node.
     * @param {Array<MemberNode>} members The members to add.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {ObjectNode} The object node.
     */
    export function object(members: Array<MemberNode>, parts?: NodeParts): ObjectNode;
    /**
     * Creates a member node.
     * @param {StringNode|IdentifierNode} name The name for the member.
     * @param {ValueNode} value The value for the member.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {MemberNode} The member node.
     */
    export function member(name: StringNode | IdentifierNode, value: ValueNode, parts?: NodeParts): MemberNode;
    /**
     * Creates an identifier node.
     * @param {string} name The name for the identifier.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {IdentifierNode} The identifier node.
     */
    export function identifier(name: string, parts?: NodeParts): IdentifierNode;
    /**
     * Creates a NaN node.
     * @param {Sign} sign The sign for the Infinity.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {NaNNode} The NaN node.
     */
    export function nan(sign?: Sign, parts?: NodeParts): NaNNode;
    /**
     * Creates an Infinity node.
     * @param {Sign} sign The sign for the Infinity.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {InfinityNode} The Infinity node.
     */
    export function infinity(sign?: Sign, parts?: NodeParts): InfinityNode;
}
/**
 * @fileoverview Traversal approaches for Momoa JSON AST.
 * @author Nicholas C. Zakas
 */
/** @typedef {import("./typedefs.cjs").TraversalPhase} TraversalPhase */
/**
 * @typedef {Object} TraversalVisitor
 * @property {(node: Node, parent?: Node) => void} [enter]
 * @property {(node: Node, parent?: Node) => void} [exit]
 */
declare const childKeys: Map<string, string[]>;
export { childKeys as visitorKeys };
