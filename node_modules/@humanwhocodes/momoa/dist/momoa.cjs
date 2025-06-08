'use strict';

/**
 * @fileoverview Character codes.
 * @author Nicholas C. Zakas
 */

const CHAR_0 = 48;          // 0
const CHAR_1 = 49;          // 1
const CHAR_9 = 57;          // 9
const CHAR_BACKSLASH = 92;  // \
const CHAR_DOLLAR = 36;     // $
const CHAR_DOT = 46;        // .
const CHAR_DOUBLE_QUOTE = 34; // "
const CHAR_LOWER_A = 97;    // a
const CHAR_LOWER_E = 101;         // e
const CHAR_LOWER_F = 102;   // f
const CHAR_LOWER_N = 110;   // n
const CHAR_LOWER_T = 116;   // t
const CHAR_LOWER_U = 117;   // u
const CHAR_LOWER_X = 120;   // x
const CHAR_LOWER_Z = 122;   // z
const CHAR_MINUS = 45;      // -
const CHAR_NEWLINE = 10;    // newline
const CHAR_PLUS = 43;       // +
const CHAR_RETURN = 13;     // return
const CHAR_SINGLE_QUOTE = 39; // '
const CHAR_SLASH = 47;      // /
const CHAR_SPACE = 32;      // space
const CHAR_TAB = 9;         // tab
const CHAR_UNDERSCORE = 95; // _
const CHAR_UPPER_A = 65;    // A
const CHAR_UPPER_E = 69;          // E
const CHAR_UPPER_F = 70;    // F
const CHAR_UPPER_N = 78;    // N
const CHAR_UPPER_X = 88;    // X
const CHAR_UPPER_Z = 90;    // Z
const CHAR_LOWER_B = 98;    // b
const CHAR_LOWER_R = 114;   // r
const CHAR_LOWER_V = 118;   // v
const CHAR_LINE_SEPARATOR = 0x2028;
const CHAR_PARAGRAPH_SEPARATOR = 0x2029;
const CHAR_UPPER_I = 73;    // I
const CHAR_STAR = 42;       // *
const CHAR_VTAB = 11;            // U+000B Vertical tab
const CHAR_FORM_FEED = 12;       // U+000C Form feed
const CHAR_NBSP = 160;           // U+00A0 Non-breaking space
const CHAR_BOM = 65279;          // U+FEFF
const CHAR_NON_BREAKING_SPACE = 160;
const CHAR_EN_QUAD = 8192;
const CHAR_EM_QUAD = 8193;
const CHAR_EN_SPACE = 8194;
const CHAR_EM_SPACE = 8195;
const CHAR_THREE_PER_EM_SPACE = 8196;
const CHAR_FOUR_PER_EM_SPACE = 8197;
const CHAR_SIX_PER_EM_SPACE = 8198;
const CHAR_FIGURE_SPACE = 8199;
const CHAR_PUNCTUATION_SPACE = 8200;
const CHAR_THIN_SPACE = 8201;
const CHAR_HAIR_SPACE = 8202;
const CHAR_NARROW_NO_BREAK_SPACE = 8239;
const CHAR_MEDIUM_MATHEMATICAL_SPACE = 8287;
const CHAR_IDEOGRAPHIC_SPACE = 12288;

/**
 * @fileoverview JSON syntax helpers
 * @author Nicholas C. Zakas
 */


//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").TokenType} TokenType */

//-----------------------------------------------------------------------------
// Predefined Tokens
//-----------------------------------------------------------------------------

const LBRACKET = "[";
const RBRACKET = "]";
const LBRACE = "{";
const RBRACE = "}";
const COLON = ":";
const COMMA = ",";

const TRUE = "true";
const FALSE = "false";
const NULL = "null";
const NAN$1 = "NaN";
const INFINITY$1 = "Infinity";
const QUOTE = "\"";

const escapeToChar = new Map([
    [CHAR_DOUBLE_QUOTE, QUOTE],
    [CHAR_BACKSLASH, "\\"],
    [CHAR_SLASH, "/"],
    [CHAR_LOWER_B, "\b"],
    [CHAR_LOWER_N, "\n"],
    [CHAR_LOWER_F, "\f"],
    [CHAR_LOWER_R, "\r"],
    [CHAR_LOWER_T, "\t"]
]);

const json5EscapeToChar = new Map([
    ...escapeToChar,
    [CHAR_LOWER_V, "\v"],
    [CHAR_0, "\0"]
]);

const charToEscape = new Map([
    [QUOTE, QUOTE],
    ["\\", "\\"],
    ["/", "/"],
    ["\b", "b"],
    ["\n", "n"],
    ["\f", "f"],
    ["\r", "r"],
    ["\t", "t"]
]);

const json5CharToEscape = new Map([
    ...charToEscape,
    ["\v", "v"],
    ["\0", "0"],
    ["\u2028", "u2028"],
    ["\u2029", "u2029"]
]);

/** @type {Map<string,TokenType>} */
const knownTokenTypes = new Map([
    [LBRACKET, "LBracket"],
    [RBRACKET, "RBracket"],
    [LBRACE, "LBrace"],
    [RBRACE, "RBrace"],
    [COLON, "Colon"],
    [COMMA, "Comma"],
    [TRUE, "Boolean"],
    [FALSE, "Boolean"],
    [NULL, "Null"]
]);

/** @type {Map<string,TokenType>} */
const knownJSON5TokenTypes = new Map([
    ...knownTokenTypes,
    [NAN$1, "Number"],
    [INFINITY$1, "Number"]
]);

// JSON5
const json5LineTerminators = new Set([
    CHAR_NEWLINE,
    CHAR_RETURN,
    CHAR_LINE_SEPARATOR,
    CHAR_PARAGRAPH_SEPARATOR
]);

/**
 * @fileoverview JSON tokenization/parsing errors
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */
/** @typedef {import("./typedefs.js").Token} Token */

//-----------------------------------------------------------------------------
// Errors
//-----------------------------------------------------------------------------

/**
 * Base class that attaches location to an error.
 */
class ErrorWithLocation extends Error {

    /**
     * Creates a new instance.
     * @param {string} message The error message to report. 
     * @param {Location} loc The location information for the error.
     */
    constructor(message, { line, column, offset }) {
        super(`${ message } (${ line }:${ column})`);

        /**
         * The line on which the error occurred.
         * @type {number}
         */
        this.line = line;

        /**
         * The column on which the error occurred.
         * @type {number}
         */
        this.column = column;
        
        /**
         * The index into the string where the error occurred.
         * @type {number}
         */
        this.offset = offset;
    }

}

/**
 * Error thrown when an unexpected character is found during tokenizing.
 */
class UnexpectedChar extends ErrorWithLocation {

    /**
     * Creates a new instance.
     * @param {number} unexpected The character that was found.
     * @param {Location} loc The location information for the found character.
     */
    constructor(unexpected, loc) {
        super(`Unexpected character '${ String.fromCharCode(unexpected) }' found.`, loc);
    }
}

/**
 * Error thrown when an unexpected identifier is found during tokenizing.
 */
class UnexpectedIdentifier extends ErrorWithLocation {

    /**
     * Creates a new instance.
     * @param {string} unexpected The character that was found.
     * @param {Location} loc The location information for the found character.
     */
    constructor(unexpected, loc) {
        super(`Unexpected identifier '${ unexpected }' found.`, loc);
    }
}

/**
 * Error thrown when an unexpected token is found during parsing.
 */
class UnexpectedToken extends ErrorWithLocation {

    /**
     * Creates a new instance.
     * @param {Token} token The token that was found. 
     */
    constructor(token) {
        super(`Unexpected token ${ token.type } found.`, token.loc.start);
    }
}

/**
 * Error thrown when the end of input is found where it isn't expected.
 */
class UnexpectedEOF extends ErrorWithLocation {

    /**
     * Creates a new instance.
     * @param {Location} loc The location information for the found character.
     */
    constructor(loc) {
        super("Unexpected end of input found.", loc);
    }
}

/*
 * The following is extracted from https://github.com/json5/json5/
 *
 * MIT License
 * 
 * Copyright (c) 2012-2018 Aseem Kishore, and others.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
// eslint-disable-next-line no-misleading-character-class
const ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;

/**
 * @fileoverview A charactor code reader.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const CHAR_CR = 13; // \r
const CHAR_LF = 10; // \n

//-----------------------------------------------------------------------------
// CharCodeReader
//-----------------------------------------------------------------------------

/**
 * A reader that reads character codes from a string.
 */
class CharCodeReader {

    /**
     * The text to read from.
     * @type {string}
     */
    #text = "";

    /**
     * The current line number.
     * @type {number}
     */
    #line = 1;

    /**
     * The current column number.
     * @type {number}
     */
    #column = 0;

    /**
     * The current offset in the text.
     * @type {number}
     */
    #offset = -1;

    /**
     * Whether the last character read was a new line.
     * @type {boolean}
     */
    #newLine = false;

    /**
     * The last character code read.
     * @type {number}
     */
    #last = -1;

    /**
     * Whether the reader has ended.
     * @type {boolean}
     */
    #ended = false;

    /**
     * Creates a new instance.
     * @param {string} text The text to read from
     */
    constructor(text) {
        this.#text = text;
    }

    /**
     * Ends the reader.
     * @returns {void}
     */
    #end() {
        if (this.#ended) {
            return;
        }

        this.#column++;
        this.#offset++;
        this.#last = -1;
        this.#ended = true;
    }

    /**
     * Returns the current position of the reader.
     * @returns {Location} An object with line, column, and offset properties.
     */
    locate() {
        return {
            line: this.#line,
            column: this.#column,
            offset: this.#offset
        };
    }

    /**
     * Reads the next character code in the text.
     * @returns {number} The next character code, or -1 if there are no more characters.
     */
    next() {
        if (this.#offset >= this.#text.length - 1) {
            this.#end();
            return -1;
        }

        this.#offset++;
        const charCode = this.#text.charCodeAt(this.#offset);

        if (this.#newLine) {
            this.#line++;
            this.#column = 1;
            this.#newLine = false;
        } else {
            this.#column++;
        }

        if (charCode === CHAR_CR) {
            this.#newLine = true;

            // if we already see a \r, just ignore upcoming \n
            if (this.peek() === CHAR_LF) {
                this.#offset++;
            }
        } else if (charCode === CHAR_LF) {
            this.#newLine = true;
        }

        this.#last = charCode;

        return charCode;
    }

    /**
     * Peeks at the next character code in the text.
     * @returns {number} The next character code, or -1 if there are no more characters.
     */
    peek() {
        if (this.#offset === this.#text.length - 1) {
            return -1;
        }

        return this.#text.charCodeAt(this.#offset + 1);
    }

    /**
     * Determines if the next character code in the text matches a specific character code.
     * @param {(number) => boolean} fn A function to call on the next character.
     * @returns {boolean} True if the next character code matches, false if not.
     */ 
    match(fn) {
        if (fn(this.peek())) {
            this.next();
            return true;
        }

        return false;
    }

    /**
     * Returns the last character code read.
     * @returns {number} The last character code read.
     */
    current() {
        return this.#last;
    }


}

/**
 * @fileoverview JSON tokenizer
 * @author Nicholas C. Zakas
 */


//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */
/** @typedef {import("./typedefs.js").Range} Range */
/** @typedef {import("./typedefs.js").Token} Token */
/** @typedef {import("./typedefs.js").TokenType} TokenType */
/** @typedef {import("./typedefs.js").TokenizeOptions} TokenizeOptions */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const INFINITY = "Infinity";
const NAN = "NaN";

const keywordStarts = new Set([CHAR_LOWER_T, CHAR_LOWER_F, CHAR_LOWER_N]);
const whitespace = new Set([CHAR_SPACE, CHAR_TAB, CHAR_NEWLINE, CHAR_RETURN]);
const json5Whitespace = new Set([
    ...whitespace,
    CHAR_VTAB,
    CHAR_FORM_FEED,
    CHAR_NBSP,
    CHAR_LINE_SEPARATOR,
    CHAR_PARAGRAPH_SEPARATOR,
    CHAR_BOM,
    CHAR_NON_BREAKING_SPACE,
    CHAR_EN_QUAD,
    CHAR_EM_QUAD,
    CHAR_EN_SPACE,
    CHAR_EM_SPACE,
    CHAR_THREE_PER_EM_SPACE,
    CHAR_FOUR_PER_EM_SPACE,
    CHAR_SIX_PER_EM_SPACE,
    CHAR_FIGURE_SPACE,
    CHAR_PUNCTUATION_SPACE,
    CHAR_THIN_SPACE,
    CHAR_HAIR_SPACE,
    CHAR_NARROW_NO_BREAK_SPACE,
    CHAR_MEDIUM_MATHEMATICAL_SPACE,
    CHAR_IDEOGRAPHIC_SPACE,
]);


/** @type {TokenizeOptions} */
const DEFAULT_OPTIONS$1 = {
    mode: "json",
    ranges: false
};

const jsonKeywords = new Set(["true", "false", "null"]);

const tt = {
    EOF: 0,
    Number: 1,
    String: 2,
    Boolean: 3,
    Null: 4,
    NaN: 5,
    Infinity: 6,
    Identifier: 7,
    Colon: 20,
    LBrace: 21,
    RBrace: 22,
    LBracket: 23,
    RBracket: 24,
    Comma: 25,
    LineComment: 40,
    BlockComment: 41
};


// #region Helpers


/**
 * Determines if a given character is a decimal digit.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is a digit.
 */
function isDigit(c) {
    return c >= CHAR_0 && c <= CHAR_9;
}

/**
 * Determines if a given character is a hexadecimal digit.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is a hexadecimal digit.
 */
function isHexDigit(c) {
    return isDigit(c) ||
        c >= CHAR_UPPER_A && c <= CHAR_UPPER_F ||
        c >= CHAR_LOWER_A && c <= CHAR_LOWER_F;
}

/**
 * Determines if a given character is a positive digit (1-9).
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is a positive digit.
 */
function isPositiveDigit(c) {
    return c >= CHAR_1 && c <= CHAR_9;
}

/**
 * Determines if a given character is the start of a keyword.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is the start of a keyword.
 */
function isKeywordStart(c) {
    return keywordStarts.has(c);
}

/**
 * Determines if a given character is the start of a number.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is the start of a number.
 */
function isNumberStart(c) {
    return isDigit(c) || c === CHAR_DOT || c === CHAR_MINUS;
}

/**
 * Determines if a given character is the start of a JSON5 number.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is the start of a JSON5 number.
 */
function isJSON5NumberStart(c) {
    return isNumberStart(c) || c === CHAR_PLUS;
}

/**
 * Determines if a given character is the start of a string.
 * @param {number} c The character to check.
 * @param {boolean} json5 `true` if JSON5 mode is enabled.
 * @returns {boolean} `true` if the character is the start of a string.
 */
function isStringStart(c, json5) {
    return c === CHAR_DOUBLE_QUOTE || (json5 && c === CHAR_SINGLE_QUOTE);
}

/**
 * Tests that a given character is a valid first character of a
 * JSON5 identifier
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is a valid first character. 
 */
function isJSON5IdentifierStart(c) {

    // test simple cases first

    if (c === CHAR_DOLLAR || c === CHAR_UNDERSCORE || c === CHAR_BACKSLASH) {
        return true;
    }

    if (c >= CHAR_LOWER_A && c <= CHAR_LOWER_Z || c >= CHAR_UPPER_A && c <= CHAR_UPPER_Z) {
        return true;
    }

    if (c === 0x200C || c === 0x200D) {
        return true;
    }
    
    const ct = String.fromCharCode(c);
    return ID_Start.test(ct);
}

/**
 * Tests that a given character is a valid part of a JSON5 identifier.
 * @param {number} c The character to check.
 * @returns {boolean} `true` if the character is a valid part of an identifier.
 */
function isJSON5IdentifierPart(c) {

    // fast path for simple cases
    if (isJSON5IdentifierStart(c) || isDigit(c)) {
        return true;
    }

    const ct = String.fromCharCode(c);
    return ID_Continue.test(ct);
}


// #endregion

class Tokenizer {

    /**
     * Options for the tokenizer.
     * @type {TokenizeOptions}
     */
    #options;

    /**
     * The source text to tokenize.
     * @type {string}
     */
    #text;

    /**
     * The reader for the source text.
     * @type {CharCodeReader}
     */
    #reader;

    /**
     * Indicates if the tokenizer is in JSON5 mode.
     * @type {boolean}
     */
    #json5;

    /**
     * Indicates if comments are allowed.
     * @type {boolean}
     */
    #allowComments;

    /**
     * Indicates if ranges should be included in the tokens.
     * @type {boolean}
     */
    #ranges;

    /**
     * The last token type read.
     * @type {Token}
     */
    #token;

    /**
     * Determines if a character is an escaped character.
     * @type {(c:number) => boolean}
     */
    #isEscapedCharacter;

    /**
     * Determines if a character is a JSON5 line terminator.
     * @type {(c:number) => boolean}
     */
    #isJSON5LineTerminator;


    /**
     * Determines if a character is a JSON5 hex escape.
     * @type {(c:number) => boolean}
     */
    #isJSON5HexEscape;

    /**
     * Determines if a character is whitespace.
     * @type {(c:number) => boolean}
     */
    #isWhitespace;

    /**
     * Creates a new instance of the tokenizer.
     * @param {string} text The source text
     * @param {TokenizeOptions} [options] Options for the tokenizer.
     */ 
    constructor(text, options) {
        this.#text = text;
        this.#options = {
            ...DEFAULT_OPTIONS$1,
            ...options
        };

        this.#reader = new CharCodeReader(text);
        this.#json5 = this.#options.mode === "json5";
        this.#allowComments = this.#options.mode !== "json";
        this.#ranges = this.#options.ranges;

        // TODO: Clean this up
        this.#isEscapedCharacter = this.#json5 ? json5EscapeToChar.has.bind(json5EscapeToChar) : escapeToChar.has.bind(escapeToChar);
        this.#isJSON5LineTerminator = this.#json5 ? json5LineTerminators.has.bind(json5LineTerminators) : () => false;
        this.#isJSON5HexEscape = this.#json5 ? c => c === CHAR_LOWER_X : () => false;
        this.#isWhitespace = this.#json5 ? json5Whitespace.has.bind(json5Whitespace) : whitespace.has.bind(whitespace);
    }

    // #region Errors

    /**
     * Convenience function for throwing unexpected character errors.
     * @param {number} c The unexpected character.
     * @param {Location} [loc] The location of the unexpected character.
     * @returns {never}
     * @throws {UnexpectedChar} always.
     */
    #unexpected(c, loc = this.#reader.locate()) {
        throw new UnexpectedChar(c, loc);
    }

    /**
     * Convenience function for throwing unexpected identifier errors.
     * @param {string} identifier The unexpected identifier.
     * @param {Location} [loc] The location of the unexpected identifier.
     * @returns {never}
     * @throws {UnexpectedIdentifier} always.
     */
    #unexpectedIdentifier(identifier, loc = this.#reader.locate()) {
        throw new UnexpectedIdentifier(identifier, loc);
    }

    /**
    * Convenience function for throwing unexpected EOF errors.
    * @returns {never}
    * @throws {UnexpectedEOF} always.
    */
    #unexpectedEOF() {
        throw new UnexpectedEOF(this.#reader.locate());
    }

    // #endregion

    // #region Helpers

    /**
     * Creates a new token.
     * @param {TokenType} tokenType The type of token to create.
     * @param {number} length The length of the token.
     * @param {Location} startLoc The start location for the token.
     * @param {Location} [endLoc] The end location for the token.
     * @returns {Token} The token.
     */
    #createToken(tokenType, length, startLoc, endLoc) {

        const endOffset = startLoc.offset + length;

        let range = this.#options.ranges ? {
            range: /** @type {Range} */ ([startLoc.offset, endOffset])
        } : undefined;

        return {
            type: tokenType,
            loc: {
                start: startLoc,
                end: endLoc || {
                    line: startLoc.line,
                    column: startLoc.column + length,
                    offset: endOffset
                }
            },
            ...range
        };        
    }

    /**
     * Reads in a specific number of hex digits.
     * @param {number} count The number of hex digits to read.
     * @returns {string} The hex digits read.
     */
    #readHexDigits(count) {
        let value = "";
        let c;

        for (let i = 0; i < count; i++) {
            c = this.#reader.peek();
            if (isHexDigit(c)) {
                this.#reader.next();
                value += String.fromCharCode(c);
                continue;
            }

            this.#unexpected(c);
        }

        return value;
    }

    /**
     * Reads in a JSON5 identifier. Also used for JSON but we validate
     * the identifier later.
     * @param {number} c The first character of the identifier.
     * @returns {string} The identifier read.
     * @throws {UnexpectedChar} when the identifier cannot be read.
     */
    #readIdentifier(c) {
        let value = "";

        do {

            value += String.fromCharCode(c);

            if (c === CHAR_BACKSLASH) {

                c = this.#reader.next();

                if (c !== CHAR_LOWER_U) {
                    this.#unexpected(c);
                }

                value += String.fromCharCode(c);

                const hexDigits = this.#readHexDigits(4);

                // check for a valid character code
                const charCode = parseInt(hexDigits, 16);

                if (value.length === 2 && !isJSON5IdentifierStart(charCode)) {
                    const loc = this.#reader.locate();
                    this.#unexpected(CHAR_BACKSLASH, { line: loc.line, column: loc.column - 5, offset: loc.offset - 5 });
                } else if (!isJSON5IdentifierPart(charCode)) {
                    const loc = this.#reader.locate();
                    this.#unexpected(charCode, { line: loc.line, column: loc.column - 5, offset: loc.offset - 5 });
                }

                value += hexDigits;
            }

            c = this.#reader.peek();

            if (!isJSON5IdentifierPart(c)) {
                break;
            }

            this.#reader.next();

        } while (true);  // eslint-disable-line no-constant-condition

        return value;
    }

    /**
     * Reads in a string. Works for both JSON and JSON5.
     * @param {number} c The first character of the string (either " or ').
     * @returns {number} The length of the string.
     * @throws {UnexpectedChar} when the string cannot be read.
     * @throws {UnexpectedEOF} when EOF is reached before the string is finalized.
     */
    #readString(c) {
        
        const delimiter = c;
        let length = 1;
        c = this.#reader.peek();

        while (c !== -1 && c !== delimiter) {

            this.#reader.next();
            length++;

            // escapes
            if (c === CHAR_BACKSLASH) {
                c = this.#reader.peek();

                if (this.#isEscapedCharacter(c) || this.#isJSON5LineTerminator(c)) {
                    this.#reader.next();
                    length++;
                } else if (c === CHAR_LOWER_U) {
                    this.#reader.next();
                    length++;

                    const result = this.#readHexDigits(4);
                    length += result.length;
                } else if (this.#isJSON5HexEscape(c)) {
                    this.#reader.next();
                    length++;

                    // hex escapes: \xHH
                    const result = this.#readHexDigits(2);
                    length += result.length;
                } else if (this.#json5) {  // JSON doesn't allow anything else
                    this.#reader.next();
                    length++;
                } else {
                    this.#unexpected(c);
                }
            }

            c = this.#reader.peek();
        }

        if (c === -1) {
            this.#reader.next();
            this.#unexpectedEOF();
        }

        // c is the delimiter
        this.#reader.next();
        length++;

        return length;
    
    
    }

    /**
     * Reads a number. Works for both JSON and JSON5.
     * @param {number} c The first character of the number.
     * @returns {number} The length of the number.
     * @throws {UnexpectedChar} when the number cannot be read.
     * @throws {UnexpectedEOF} when EOF is reached before the number is finalized.
     */
    #readNumber(c) {
        
        // we've already read the first character
        let length = 1;

        // JSON number may start with a minus but not a plus
        // JSON5 allows a plus.
        if (c === CHAR_MINUS || this.#json5 && c === CHAR_PLUS) {
            
            c = this.#reader.peek();
            
            /*
            * JSON5 allows Infinity or NaN preceded by a sign.
            * This blocks handles +Infinity, -Infinity, +NaN, and -NaN.
            * Standalone Infinity and NaN are handled in `readJSON5Identifier()`
            */
            if (this.#json5) {

                if (c === CHAR_UPPER_I || c === CHAR_UPPER_N) {
                    this.#reader.next();
                    const identifier = this.#readIdentifier(c);

                    if (identifier !== INFINITY && identifier !== NAN) {
                        this.#unexpected(c);
                    }

                    return length + identifier.length;
                }
            }

            // Next digit cannot be zero
            if (!isDigit(c)) {
                this.#unexpected(c);
            }

            // if we made it here, we need to continue on, so register the character
            this.#reader.next();
            length++;
        }

        /*
        * In JSON, a zero must be followed by a decimal point or nothing.
        * In JSON5, a zero can additionally be followed by an `x` indicating
        * that it's a hexadecimal number.
        */
        if (c === CHAR_0) {

            // c = this.#reader.next();
            // length++;
            c = this.#reader.peek();

            // check for a hex number
            if (this.#json5 && (c === CHAR_LOWER_X || c === CHAR_UPPER_X)) {

                this.#reader.next();
                length++;

                c = this.#reader.peek();

                if (!isHexDigit(c)) {
                    this.#reader.next();
                    this.#unexpected(c);
                }

                do {
                    this.#reader.next();
                    length++;
                    c = this.#reader.peek();
                } while (isHexDigit(c));

            } else if (isDigit(c)) {
                this.#unexpected(c);
            }

        } else {

            // JSON5 allows leading decimal points
            if (!this.#json5 || c !== CHAR_DOT) {
                if (!isPositiveDigit(c)) {
                    this.#unexpected(c);
                }

                c = this.#reader.peek();

                while (isDigit(c)) {
                    this.#reader.next();
                    length++;
                    c = this.#reader.peek();
                }
            }
        }

        /*
        * In JSON, a decimal point must be followed by at least one digit.
        * In JSON5, a decimal point need not be followed by any digits.
        */
        if (c === CHAR_DOT) {
                                
            let digitCount = -1;
            this.#reader.next();
            length++;
            digitCount++;

            c = this.#reader.peek();

            while (isDigit(c)) {
                this.#reader.next();
                length++;
                digitCount++;
                c = this.#reader.peek();
            }

            if (!this.#json5 && digitCount === 0) {
                this.#reader.next();
                if (c) {
                    this.#unexpected(c);
                } else {
                    this.#unexpectedEOF();
                }
            }
        }

        // Exponent is always last
        if (c === CHAR_LOWER_E || c === CHAR_UPPER_E) {

            this.#reader.next();
            length++;
            c = this.#reader.peek();

            if (c === CHAR_PLUS || c === CHAR_MINUS) {
                this.#reader.next();
                length++;
                c = this.#reader.peek();
            }

            /*
            * Must always have a digit in this position to avoid:
            * 5e
            * 12E+
            * 42e-
            */
            if (c === -1) {
                this.#reader.next();
                this.#unexpectedEOF();
            }

            if (!isDigit(c)) {
                this.#reader.next();
                this.#unexpected(c);
            }

            while (isDigit(c)) {
                this.#reader.next();
                length++;
                c = this.#reader.peek();
            }
        }

        return length;
    }

    /**
     * Reads a comment. Works for both JSON and JSON5.
     * @param {number} c The first character of the comment.
     * @returns {{length: number, multiline: boolean}} The length of the comment, and whether the comment is multi-line.
     * @throws {UnexpectedChar} when the comment cannot be read.
     * @throws {UnexpectedEOF} when EOF is reached before the comment is finalized.
     */ 
    #readComment(c) {
        
        let length = 1;

        // next character determines single- or multi-line
        c = this.#reader.peek();

        // single-line comments
        if (c === CHAR_SLASH) {
            
            do {
                this.#reader.next();
                length += 1;
                c = this.#reader.peek();
            } while (c > -1 && c !== CHAR_RETURN && c !== CHAR_NEWLINE);

            return { length, multiline: false };
        }

        // multi-line comments
        if (c === CHAR_STAR) {

            this.#reader.next();
            length += 1;

            while (c > -1) {
                c = this.#reader.peek();

                // check for end of comment
                if (c === CHAR_STAR) {
                    this.#reader.next();
                    length += 1;
                    c = this.#reader.peek();
                    
                    //end of comment
                    if (c === CHAR_SLASH) {
                        this.#reader.next();
                        length += 1;

                        return { length, multiline: true };
                    }
                } else {
                    this.#reader.next();
                    length += 1;
                }
            }

            this.#reader.next();
            this.#unexpectedEOF();
            
        }

        // if we've made it here, there's an invalid character
        this.#reader.next();
        this.#unexpected(c);        
    }
    // #endregion

    /**
     * Returns the next token in the source text.
     * @returns {number} The code for the next token.
     */
    next() {

        let c = this.#reader.next();

        while (this.#isWhitespace(c)) {
            c = this.#reader.next();
        }

        if (c === -1) {
            return tt.EOF;
        }

        const start = this.#reader.locate();
        const ct = String.fromCharCode(c);

        // check for JSON5 syntax only
        if (this.#json5) {
                
            if (knownJSON5TokenTypes.has(ct)) {
                this.#token = this.#createToken(knownJSON5TokenTypes.get(ct), 1, start);
            } else if (isJSON5IdentifierStart(c)) {
                const value = this.#readIdentifier(c);

                if (knownJSON5TokenTypes.has(value)) {
                    this.#token = this.#createToken(knownJSON5TokenTypes.get(value), value.length, start);
                } else {
                    this.#token = this.#createToken("Identifier", value.length, start);
                }
            } else if (isJSON5NumberStart(c)) {
                const result = this.#readNumber(c);
                this.#token = this.#createToken("Number", result, start);
            } else if (isStringStart(c, this.#json5)) {
                const result = this.#readString(c);
                const lastCharLoc = this.#reader.locate();
                this.#token = this.#createToken("String", result, start, {
                    line: lastCharLoc.line,
                    column: lastCharLoc.column + 1,
                    offset: lastCharLoc.offset + 1
                });
            } else if (c === CHAR_SLASH && this.#allowComments) {
                const result = this.#readComment(c);
                const lastCharLoc = this.#reader.locate();
                this.#token = this.#createToken(!result.multiline ? "LineComment" : "BlockComment", result.length, start, {
                    line: lastCharLoc.line,
                    column: lastCharLoc.column + 1,
                    offset: lastCharLoc.offset + 1
                });
            } else {
                this.#unexpected(c);
            }

        } else {

            // check for JSON/JSONC syntax only
            if (knownTokenTypes.has(ct)) {
                this.#token = this.#createToken(knownTokenTypes.get(ct), 1, start);
            } else if (isKeywordStart(c)) {
                const value = this.#readIdentifier(c);

                if (!jsonKeywords.has(value)) {
                    this.#unexpectedIdentifier(value, start);
                }

                this.#token = this.#createToken(knownTokenTypes.get(value), value.length, start);
            } else if (isNumberStart(c)) {
                const result = this.#readNumber(c);
                this.#token = this.#createToken("Number", result, start);
            } else if (isStringStart(c, this.#json5)) {
                const result = this.#readString(c);
                this.#token = this.#createToken("String", result, start);
            } else if (c === CHAR_SLASH && this.#allowComments) {
                const result = this.#readComment(c);
                const lastCharLoc = this.#reader.locate();
                this.#token = this.#createToken(!result.multiline ? "LineComment" : "BlockComment", result.length, start, {
                    line: lastCharLoc.line,
                    column: lastCharLoc.column + 1,
                    offset: lastCharLoc.offset + 1
                });
            } else {
                this.#unexpected(c);
            }
        }
        return tt[this.#token.type];
    }

    /**
     * Returns the current token in the source text.
     * @returns {Token} The current token.
     */
    get token() {
        return this.#token;
    }
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

/**
 * Creates an iterator over the tokens representing the source text.
 * @param {string} text The source text to tokenize.
 * @param {TokenizeOptions} [options] Options for doing the tokenization.
 * @returns {Array<Token>} An iterator over the tokens. 
 */
function tokenize(text, options) {

    const tokenizer = new Tokenizer(text, options);
    const tokens = [];

    while (tokenizer.next() !== tt.EOF) {
        tokens.push(tokenizer.token);
    }

    return tokens;

}

/**
 * @fileoverview  JSON AST types
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */
/** @typedef {import("./typedefs.js").NodeParts} NodeParts */
/** @typedef {import("./typedefs.js").DocumentNode} DocumentNode */
/** @typedef {import("./typedefs.js").StringNode} StringNode */
/** @typedef {import("./typedefs.js").NumberNode} NumberNode */
/** @typedef {import("./typedefs.js").BooleanNode} BooleanNode */
/** @typedef {import("./typedefs.js").MemberNode} MemberNode */
/** @typedef {import("./typedefs.js").ObjectNode} ObjectNode */
/** @typedef {import("./typedefs.js").ElementNode} ElementNode */
/** @typedef {import("./typedefs.js").ArrayNode} ArrayNode */
/** @typedef {import("./typedefs.js").NullNode} NullNode */
/** @typedef {import("./typedefs.js").ValueNode} ValueNode */
/** @typedef {import("./typedefs.js").IdentifierNode} IdentifierNode */
/** @typedef {import("./typedefs.js").NaNNode} NaNNode */
/** @typedef {import("./typedefs.js").InfinityNode} InfinityNode */
/** @typedef {import("./typedefs.js").Sign} Sign */

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

const types = {

    /**
     * Creates a document node.
     * @param {ValueNode} body The body of the document.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {DocumentNode} The document node.
     */
    document(body, parts = {}) {
        return {
            type: "Document",
            body,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a string node.
     * @param {string} value The value for the string.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {StringNode} The string node.
     */
    string(value, parts = {}) {
        return {
            type: "String",
            value,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a number node.
     * @param {number} value The value for the number.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {NumberNode} The number node.
     */
    number(value, parts = {}) {
        return {
            type: "Number",
            value,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a boolean node.
     * @param {boolean} value The value for the boolean.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {BooleanNode} The boolean node.
     */
    boolean(value, parts = {}) {
        return {
            type: "Boolean",
            value,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a null node.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {NullNode} The null node.
     */
    null(parts = {}) {
        return {
            type: "Null",
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates an array node.
     * @param {Array<ElementNode>} elements The elements to add.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {ArrayNode} The array node.
     */
    array(elements, parts = {}) {
        return {
            type: "Array",
            elements,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates an element node.
     * @param {ValueNode} value The value for the element.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {ElementNode} The element node.
     */
    element(value, parts = {}) {
        return {
            type: "Element",
            value,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates an object node.
     * @param {Array<MemberNode>} members The members to add.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {ObjectNode} The object node.
     */
    object(members, parts = {}) {
        return {
            type: "Object",
            members,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a member node.
     * @param {StringNode|IdentifierNode} name The name for the member.
     * @param {ValueNode} value The value for the member.
     * @param {NodeParts} parts Additional properties for the node. 
     * @returns {MemberNode} The member node.
     */
    member(name, value, parts = {}) {
        return {
            type: "Member",
            name,
            value,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates an identifier node.
     * @param {string} name The name for the identifier.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {IdentifierNode} The identifier node.
     */
    identifier(name, parts = {}) {
        return {
            type: "Identifier",
            name,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates a NaN node.
     * @param {Sign} sign The sign for the Infinity.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {NaNNode} The NaN node.
     */ 
    nan(sign = "", parts = {}) {
        return {
            type: "NaN",
            sign,
            loc: parts.loc,
            ...parts
        };
    },

    /**
     * Creates an Infinity node.
     * @param {Sign} sign The sign for the Infinity.
     * @param {NodeParts} parts Additional properties for the node.
     * @returns {InfinityNode} The Infinity node.
     */
    infinity(sign = "", parts = {}) {
        return {
            type: "Infinity",
            sign,
            loc: parts.loc,
            ...parts
        };
    },

};

/**
 * @fileoverview JSON parser
 * @author Nicholas C. Zakas
 */


//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */
/** @typedef {import("./typedefs.js").Token} Token */
/** @typedef {import("./typedefs.js").TokenType} TokenType */
/** @typedef {import("./typedefs.js").Node} Node */
/** @typedef {import("./typedefs.js").Mode} Mode */
/** @typedef {import("./typedefs.js").ParseOptions} ParseOptions */
/** @typedef {import("./typedefs.js").DocumentNode} DocumentNode */
/** @typedef {import("./typedefs.js").StringNode} StringNode */
/** @typedef {import("./typedefs.js").NumberNode} NumberNode */
/** @typedef {import("./typedefs.js").BooleanNode} BooleanNode */
/** @typedef {import("./typedefs.js").MemberNode} MemberNode */
/** @typedef {import("./typedefs.js").ObjectNode} ObjectNode */
/** @typedef {import("./typedefs.js").ElementNode} ElementNode */
/** @typedef {import("./typedefs.js").ArrayNode} ArrayNode */
/** @typedef {import("./typedefs.js").NullNode} NullNode */
/** @typedef {import("./typedefs.js").IdentifierNode} IdentifierNode */
/** @typedef {import("./typedefs.js").NaNNode} NaNNode */
/** @typedef {import("./typedefs.js").InfinityNode} InfinityNode */
/** @typedef {import("./typedefs.js").Sign} Sign */
/** @typedef {import("./typedefs.js").ValueNode} ValueNode */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/** @type {ParseOptions} */
const DEFAULT_OPTIONS = {
    mode: "json",
    ranges: false,
    tokens: false,
    allowTrailingCommas: false
};

const UNICODE_SEQUENCE = /\\u[\da-fA-F]{4}/gu;

/**
 * Normalizes a JSON5 identifier by converting Unicode escape sequences into
 * their corresponding characters.
 * @param {string} identifier The identifier to normalize.
 * @returns {string} The normalized identifier.
 */
function normalizeIdentifier(identifier) {
    return identifier.replace(UNICODE_SEQUENCE, unicodeEscape => {
        return String.fromCharCode(parseInt(unicodeEscape.slice(2), 16));
    });
}

/**
 * Converts a JSON-encoded string into a JavaScript string, interpreting each
 * escape sequence.
 * @param {string} value The text for the token.
 * @param {Token} token The string token to convert into a JavaScript string.
 * @param {boolean} json5 `true` if parsing JSON5, `false` otherwise.
 * @returns {string} A JavaScript string.
 */
function getStringValue(value, token, json5 = false) {
    
    let result = "";
    let escapeIndex = value.indexOf("\\");
    let lastIndex = 0;

    // While there are escapes, interpret them to build up the result
    while (escapeIndex >= 0) {

        // append the text that happened before the escape
        result += value.slice(lastIndex, escapeIndex);

        // get the character immediately after the \
        const escapeChar = value.charAt(escapeIndex + 1);
        const escapeCharCode = escapeChar.charCodeAt(0);
        
        // check for the non-Unicode escape sequences first
        if (json5 && json5EscapeToChar.has(escapeCharCode)) {
            result += json5EscapeToChar.get(escapeCharCode);
            lastIndex = escapeIndex + 2;
        } else if (escapeToChar.has(escapeCharCode)) {
            result += escapeToChar.get(escapeCharCode);
            lastIndex = escapeIndex + 2;
        } else if (escapeChar === "u") {
            const hexCode = value.slice(escapeIndex + 2, escapeIndex + 6);
            if (hexCode.length < 4 || /[^0-9a-f]/i.test(hexCode)) {
                throw new ErrorWithLocation(
                    `Invalid unicode escape \\u${ hexCode}.`,
                    {
                        line: token.loc.start.line,
                        column: token.loc.start.column + escapeIndex,
                        offset: token.loc.start.offset + escapeIndex
                    }
                );
            }

            result += String.fromCharCode(parseInt(hexCode, 16));
            lastIndex = escapeIndex + 6;
        } else if (json5 && escapeChar === "x") {
            const hexCode = value.slice(escapeIndex + 2, escapeIndex + 4);
            if (hexCode.length < 2 || /[^0-9a-f]/i.test(hexCode)) {
                throw new ErrorWithLocation(
                    `Invalid hex escape \\x${ hexCode}.`,
                    {
                        line: token.loc.start.line,
                        column: token.loc.start.column + escapeIndex,
                        offset: token.loc.start.offset + escapeIndex
                    }
                );
            }

            result += String.fromCharCode(parseInt(hexCode, 16));
            lastIndex = escapeIndex + 4;
        } else if (json5 && json5LineTerminators.has(escapeCharCode)) {
            lastIndex = escapeIndex + 2;

            // we also need to skip \n after a \r
            if (escapeChar === "\r" && value.charAt(lastIndex) === "\n") {
                lastIndex++;
            }
            
        } else {
            // all characters can be escaped in JSON5
            if (json5) {
                result += escapeChar;
                lastIndex = escapeIndex + 2;
            } else {
                throw new ErrorWithLocation(
                    `Invalid escape \\${ escapeChar }.`,
                    {
                        line: token.loc.start.line,
                        column: token.loc.start.column + escapeIndex,
                        offset: token.loc.start.offset + escapeIndex
                    }
                );
            }
        }

        // find the next escape sequence
        escapeIndex = value.indexOf("\\", lastIndex);
    }

    // get the last segment of the string value
    result += value.slice(lastIndex);

    return result;
}

/**
 * Gets the JavaScript value represented by a JSON token.
 * @param {string} value The text value of the token.
 * @param {Token} token The JSON token to get a value for.
 * @param {boolean} json5 `true` if parsing JSON5, `false` otherwise.
 * @returns {string|boolean|number} A number, string, or boolean.
 * @throws {TypeError} If an unknown token type is found. 
 */
function getLiteralValue(value, token, json5 = false) {
    switch (token.type) {
        case "Boolean":
            return value === "true";
            
        case "Number":
            if (json5) {

                /*
                 * Numbers like -0x1 are converted to NaN by Number(), so we need
                 * to handle them separately. Rather than checking for -0x, we can
                 * just check if the first character is a minus sign. The same for
                 * checking for +0x.
                 */

                if (value.charCodeAt(0) === 45) { // 45 is the char code for '-'
                    return -Number(value.slice(1));
                }

                if (value.charCodeAt(0) === 43) { // 43 is the char code for '+'
                    return Number(value.slice(1));
                }
            }
            return Number(value);

        case "String":
            return getStringValue(value.slice(1, -1), token, json5);

        default:
            throw new TypeError(`Unknown token type "${token.type}.`);
    }
}

//-----------------------------------------------------------------------------
// Main Function
//-----------------------------------------------------------------------------

/**
 * 
 * @param {string} text The text to parse.
 * @param {ParseOptions} [options] The options object.
 * @returns {DocumentNode} The AST representing the parsed JSON.
 * @throws {Error} When there is a parsing error. 
 */
function parse(text, options) {

    options = Object.freeze({
        ...DEFAULT_OPTIONS,
        ...options
    });

    const tokens = [];
    const tokenizer = new Tokenizer(text, {
        mode: options.mode,
        ranges: options.ranges
    });

    const json5 = options.mode === "json5";
    const allowTrailingCommas = options.allowTrailingCommas || json5;

    /**
     * Returns the next token knowing there are no comments.
     * @returns {number} The next token type or 0 if no next token.
     */
    function nextNoComments() {
        const nextType = tokenizer.next();

        if (nextType && options.tokens) {
            tokens.push(tokenizer.token);
        }
        return nextType;
    }
    
    /**
     * Returns the next token knowing there are comments to skip.
     * @returns {number} The next token type or 0 if no next token.
     */
    function nextSkipComments() {
        const nextType = tokenizer.next();
        if (nextType && options.tokens) {
            tokens.push(tokenizer.token);
        }

        if (nextType >= tt.LineComment) {
            return nextSkipComments();
        }

        return nextType;

    }

    // determine correct way to evaluate tokens based on presence of comments
    const next = options.mode === "json" ? nextNoComments : nextSkipComments;

    /**
     * Asserts a token has the given type.
     * @param {number} token The token to check.
     * @param {number} type The token type.
     * @throws {UnexpectedToken} If the token type isn't expected.
     * @returns {void}
     */
    function assertTokenType(token, type) {
        if (token !== type) {
            throw new UnexpectedToken(tokenizer.token);
        }
    }

    /**
     * Asserts a token has one of the given types.
     * @param {number} token The token to check.
     * @param {number[]} types The token types.
     * @returns {void}
     * @throws {UnexpectedToken} If the token type isn't expected.
     */ 
    function assertTokenTypes(token, types) {
        if (!types.includes(token)) {
            throw new UnexpectedToken(tokenizer.token);
        }
    }

    /**
     * Creates a range only if ranges are specified.
     * @param {Location} start The start offset for the range.
     * @param {Location} end The end offset for the range.
     * @returns {{range:[number,number]}|undefined} An object with a 
     */
    function createRange(start, end) {
        // @ts-ignore tsc incorrect - options might be undefined
        return options.ranges ? {
            range: [start.offset, end.offset]
        } : undefined;
    }

    /**
     * Creates a node for a string, boolean, or number.
     * @param {number} tokenType The token representing the literal. 
     * @returns {StringNode|NumberNode|BooleanNode} The node representing
     *      the value.
     */
    function createLiteralNode(tokenType) {
        const token = tokenizer.token;
        const range = createRange(token.loc.start, token.loc.end);
        const value = getLiteralValue(
            text.slice(token.loc.start.offset, token.loc.end.offset),
            token,
            json5
        );
        const loc = {
            start: {
                ...token.loc.start
            },
            end: {
                ...token.loc.end
            }
        };
        const parts = { loc, ...range };

        switch (tokenType) {
            case tt.String:
                return types.string(/** @type {string} */ (value), parts);

            case tt.Number:
                return types.number(/** @type {number} */ (value), parts);
                
            case tt.Boolean:
                return types.boolean(/** @type {boolean} */ (value), parts);

            default:
                throw new TypeError(`Unknown token type ${token.type}.`);
        }
    }

    /**
     * Creates a node for a JSON5 identifier.
     * @param {Token} token The token representing the identifer. 
     * @returns {NaNNode|InfinityNode|IdentifierNode} The node representing
     *      the value.
     */
    function createJSON5IdentifierNode(token) {
        const range = createRange(token.loc.start, token.loc.end);
        const identifier = text.slice(token.loc.start.offset, token.loc.end.offset);
        const loc = {
            start: {
                ...token.loc.start
            },
            end: {
                ...token.loc.end
            }
        };
        const parts = { loc, ...range };

        // Check for NaN or Infinity
        if (token.type !== "Identifier") {

            let sign = "";

            // check if the first character in the token is a plus or minus
            if (identifier[0] === "+" || identifier[0] === "-") {
                sign = identifier[0];
            }

            // check if the token is NaN or Infinity
            return types[identifier.includes("NaN") ? "nan" : "infinity"](/** @type {Sign} */ (sign), parts);
        }
        return types.identifier(normalizeIdentifier(identifier), parts);
    }

    /**
     * Creates a node for a null.
     * @param {Token} token The token representing null. 
     * @returns {NullNode} The node representing null.
     */
    function createNullNode(token) {
        const range = createRange(token.loc.start, token.loc.end);

        return types.null({
            loc: {
                start: {
                    ...token.loc.start
                },
                end: {
                    ...token.loc.end
                }
            },
            ...range
        });
    }


    /**
     * Parses a property in an object.
     * @param {number} tokenType The token representing the property.
     * @returns {MemberNode} The node representing the property.
     * @throws {UnexpectedToken} When an unexpected token is found.
     * @throws {UnexpectedEOF} When the end of the file is reached.
     */
    function parseProperty(tokenType) {

        if (json5) {
            assertTokenTypes(tokenType, [tt.String, tt.Identifier, tt.Number]);
        } else {
            assertTokenType(tokenType, tt.String);
        }

        const token = tokenizer.token;

        // check for -NaN, +NaN, -Infinity, +Infinity, and any number
        if (json5 && tokenType === tt.Number && /[+\-0-9]/.test(text[token.loc.start.offset])) {
            throw new UnexpectedToken(token);
        }

        // TODO: Clean this up a bit
        let key = tokenType === tt.String
            ? /** @type {StringNode} */ (createLiteralNode(tokenType))
            : /** @type {IdentifierNode|NaNNode|InfinityNode} */ (createJSON5IdentifierNode(token));

        // in JSON5, need to check for NaN and Infinity and create identifier nodes
        if (json5 && (key.type === "NaN" || key.type === "Infinity")) {

            // NaN and Infinity cannot be signed and be a property key
            if (key.sign !== "") {
                throw new UnexpectedToken(tokenizer.token);
            }

            key = types.identifier(key.type, { loc: key.loc, ...createRange(key.loc.start, key.loc.end) });
        }

        tokenType = next();
        assertTokenType(tokenType, tt.Colon);
        const value = parseValue();
        const range = createRange(key.loc.start, value.loc.end);

        return types.member(
            /** @type {StringNode|IdentifierNode} */ (key),
            /** @type {ValueNode} */ (value),
            {
                loc: {
                    start: {
                        ...key.loc.start
                    },
                    end: {
                        ...value.loc.end
                    }
                },
                ...range
            }
        );
    }

    /**
     * Parses an object literal.
     * @param {number} firstTokenType The first token type in the object.
     * @returns {ObjectNode} The object node.
     * @throws {UnexpectedEOF} When the end of the file is reached.
     * @throws {UnexpectedToken} When an unexpected token is found.
     */
    function parseObject(firstTokenType) {

        // The first token must be a { or else it's an error
        assertTokenType(firstTokenType, tt.LBrace);

        const firstToken = tokenizer.token;
        const members = [];
        let tokenType = next();

        if (tokenType !== tt.RBrace) {
            do {
    
                // add the value into the array
                members.push(parseProperty(tokenType));
    
                tokenType = next();

                if (!tokenType) {
                    throw new UnexpectedEOF(members[members.length-1].loc.end);
                }
    
                if (tokenType === tt.Comma) {
                    tokenType = next();

                    /*
                      * Trailing commas.
                      * So we need to check if the token is a comma,
                      * and if so, then we need to check if the next
                      * token is a RBrace. If it is, then we need to
                      * break out of the loop.
                      */
                    if (allowTrailingCommas && tokenType === tt.RBrace) {
                        break;
                    }                      
                } else {
                    break;
                }
            } while (tokenType);
        }

        assertTokenType(tokenType, tt.RBrace);
        const lastToken = tokenizer.token;
        const range = createRange(firstToken.loc.start, lastToken.loc.end);

        return types.object(members, {
            loc: {
                start: {
                    ...firstToken.loc.start
                },
                end: {
                    ...lastToken.loc.end
                }
            },
            ...range
        });

    }

    /**
     * Parses an array literal.
     * @param {number} firstTokenType The first token in the array.
     * @returns {ArrayNode} The array node.
     * @throws {UnexpectedToken} When an unexpected token is found.
     * @throws {UnexpectedEOF} When the end of the file is reached.
     */
    function parseArray(firstTokenType) {

        // The first token must be a [ or else it's an error
        assertTokenType(firstTokenType, tt.LBracket);

        const firstToken = tokenizer.token;
        const elements = [];
        let tokenType = next();
        
        if (tokenType !== tt.RBracket) {

            do {

                // add the value into the array
                const value = parseValue(tokenType);

                elements.push(types.element(
                    /** @type {ValueNode} */ (value),
                    { loc: value.loc }
                ));

                tokenType = next();
              
                if (tokenType === tt.Comma) {
                    tokenType = next();

                    /*
                      * Trailing commas.
                      * So we need to check if the token is a comma,
                      * and if so, then we need to check if the next
                      * token is a RBracket. If it is, then we need to
                      * break out of the loop.
                      */
                    if (allowTrailingCommas && tokenType === tt.RBracket) {
                        break;
                    }                    
                } else {
                    break;
                }
            } while (tokenType);
        }

        assertTokenType(tokenType, tt.RBracket);

        const lastToken = tokenizer.token;
        const range = createRange(firstToken.loc.start, lastToken.loc.end);

        return types.array(elements, {
            loc: {
                start: {
                    ...firstToken.loc.start
                },
                end: {
                    ...lastToken.loc.end
                }
            },
            ...range
        });

    }

    /**
     * Parses a JSON value.
     * @param {number} [tokenType] The token type to parse.
     * @returns {ValueNode|IdentifierNode} The node representing the value.
     */
    function parseValue(tokenType) {

        tokenType = tokenType ?? next();
        const token = tokenizer.token;
        
        switch (tokenType) {
            case tt.String:
            case tt.Boolean:
                return createLiteralNode(tokenType);

            case tt.Number:
                if (json5) {
                    let tokenText = text.slice(token.loc.start.offset, token.loc.end.offset);
                    if (tokenText[0] === "+" || tokenText[0] === "-") {
                        tokenText = tokenText.slice(1);
                    }

                    if (tokenText === "NaN" || tokenText === "Infinity") {
                        return createJSON5IdentifierNode(token);
                    }
                }
                return createLiteralNode(tokenType);

            case tt.Null:
                return createNullNode(token);

            case tt.LBrace:
                return parseObject(tokenType);

            case tt.LBracket:
                return parseArray(tokenType);

            default:
                throw new UnexpectedToken(token);
        }

    }

    
    const docBody = parseValue();
    
    const unexpectedToken = next();
    if (unexpectedToken) {
        throw new UnexpectedToken(tokenizer.token);
    }
    
    
    const docParts = {
        loc: {
            start: {
                line: 1,
                column: 1,
                offset: 0
            },
            end: {
                ...docBody.loc.end
            }
        }
    };
    
    if (options.tokens) {
        docParts.tokens = tokens;
    }

    if (options.ranges) {
        docParts.range = [
            docParts.loc.start.offset,
            docParts.loc.end.offset
        ];
    }

    return types.document(/** @type {ValueNode} */ (docBody), docParts);
}

/**
 * @fileoverview Traversal approaches for Momoa JSON AST.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Node} Node */
/** @typedef {import("./typedefs.js").TraversalPhase} TraversalPhase */
/**
 * @typedef {Object} TraversalVisitor
 * @property {(node: Node, parent?: Node) => void} [enter]
 * @property {(node: Node, parent?: Node) => void} [exit]
 */

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const childKeys = new Map([
    ["Document", ["body"]],
    ["Object", ["members"]],
    ["Member", ["name", "value"]],
    ["Element", ["value"]],
    ["Array", ["elements"]],
    ["String", []],
    ["Number", []],
    ["Boolean", []],
    ["Null", []],
    ["NaN", []],
    ["Infinity", []],
    ["Identifier", []],
]);

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Determines if a given value is an object.
 * @param {*} value The value to check.
 * @returns {boolean} True if the value is an object, false if not. 
 */
function isObject(value) {
    return value && (typeof value === "object");
}

/**
 * Determines if a given value is an AST node.
 * @param {*} value The value to check.
 * @returns {boolean} True if the value is a node, false if not. 
 */
function isNode(value) {
    return isObject(value) && (typeof value.type === "string");
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Traverses an AST from the given node.
 * @param {Node} root The node to traverse from 
 * @param {TraversalVisitor} visitor An object with an `enter` and `exit` method. 
 */
function traverse(root, visitor) {

    /**
     * Recursively visits a node.
     * @param {Node} node The node to visit.
     * @param {Node} [parent] The parent of the node to visit.
     * @returns {void}
     */
    function visitNode(node, parent) {

        if (typeof visitor.enter === "function") {
            visitor.enter(node, parent);
        }

        for (const key of childKeys.get(node.type)) {
            const value = node[key];

            if (isObject(value)) {
                if (Array.isArray(value)) {
                    value.forEach(child => visitNode(child, node));
                } else if (isNode(value)) {
                    visitNode(value, node);
                }
            }
        }

        if (typeof visitor.exit === "function") {
            visitor.exit(node, parent);
        }
    }

    visitNode(root);
}

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
function iterator(root, filter = () => true) {

    /** @type {Array<{node: Node, parent?: Node, phase: TraversalPhase}>} */
    const traversal = [];

    traverse(root, {
        enter(node, parent) {
            traversal.push({ node, parent, phase: "enter" });
        },
        exit(node, parent) {
            traversal.push({ node, parent, phase: "exit" });
        }
    });

    return traversal.filter(filter).values();
}

/**
 * @fileoverview Evaluator for Momoa AST.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Node} Node */
/** @typedef {import("./typedefs.js").NodeParts} NodeParts */
/** @typedef {import("./typedefs.js").DocumentNode} DocumentNode */
/** @typedef {import("./typedefs.js").StringNode} StringNode */
/** @typedef {import("./typedefs.js").NumberNode} NumberNode */
/** @typedef {import("./typedefs.js").BooleanNode} BooleanNode */
/** @typedef {import("./typedefs.js").MemberNode} MemberNode */
/** @typedef {import("./typedefs.js").ObjectNode} ObjectNode */
/** @typedef {import("./typedefs.js").ElementNode} ElementNode */
/** @typedef {import("./typedefs.js").ArrayNode} ArrayNode */
/** @typedef {import("./typedefs.js").NullNode} NullNode */
/** @typedef {import("./typedefs.js").AnyNode} AnyNode */
/** @typedef {import("./typedefs.js").JSONValue} JSONValue */

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Evaluates a Momoa AST node into a JavaScript value.
 * @param {AnyNode} node The node to interpet.
 * @returns {JSONValue} The JavaScript value for the node. 
 */
function evaluate(node) {
    switch (node.type) {
        case "String":
            return node.value;

        case "Number":
            return node.value;

        case "Boolean":
            return node.value;

        case "Null":
            return null;

        case "NaN":
            return NaN;
        
        case "Infinity":
            return node.sign === "-" ? -Infinity : Infinity;

        case "Identifier":
            return node.name;

        case "Array": {
            // const arrayNode = /** @type {ArrayNode} */ (node);
            return node.elements.map(element => evaluate(element.value));
        }

        case "Object": {

            /** @type {{[property: string]: JSONValue}} */
            const object = {};

            node.members.forEach(member => {
                object[/** @type {string} */ (evaluate(member.name))] = evaluate(member.value);
            });    

            return object;
        }    

        case "Document": {
            return evaluate(node.body);
        }

        case "Element":
            throw new Error("Cannot evaluate array element outside of an array.");

        case "Member":
            throw new Error("Cannot evaluate object member outside of an object.");

        default:
            // @ts-ignore tsc doesn't know about the type property here?
            throw new Error(`Unknown node type ${ node.type }.`);
    }
}

/**
 * @fileoverview Printer for Momoa AST.
 * @author Nicholas C. Zakas
 */


//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/** @typedef {import("./typedefs.js").Location} Location */
/** @typedef {import("./typedefs.js").AnyNode} AnyNode */
/** @typedef {import("./typedefs.js").BooleanNode} BooleanNode */
/** @typedef {import("./typedefs.js").NumberNode} NumberNode */
/** @typedef {import("./typedefs.js").NullNode} NullNode */
/** @typedef {import("./typedefs.js").NaNNode} NaNNode */
/** @typedef {import("./typedefs.js").InfinityNode} InfinityNode */
/** @typedef {import("./typedefs.js").StringNode} StringNode */
/** @typedef {import("./typedefs.js").IdentifierNode} IdentifierNode */
/** @typedef {import("./typedefs.js").ObjectNode} ObjectNode */
/** @typedef {import("./typedefs.js").ArrayNode} ArrayNode */
/** @typedef {import("./typedefs.js").MemberNode} MemberNode */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Prints the string representation of a Boolean node.
 * @param {BooleanNode} node The node to print.
 * @returns {string} The boolean value.
 */
function printBoolean(node) {
    return node.value ? "true" : "false";
}

/**
 * Prints the string representation of a null node.
 * @returns {string} The string "null".
 */
function printNull() {
    return "null";
}

/**
 * Prints the string representation of a number node.
 * @param {NumberNode} node The node to print.
 * @returns {string} The number value.
 */
function printNumber(node) {
    return node.value.toString();
}

/**
 * Prints the string representation of a NaN node.
 * @returns {string} The string "NaN".
 */
function printNaN() {
    return "NaN";
}

/**
 * Prints the string representation of an Infinity node.
 * @param {InfinityNode} node The node to print.
 * @returns {string} The string "Infinity" or "-Infinity".
 */
function printInfinity(node) {
    return node.sign + "Infinity";
}

/**
 * Prints the string representation of a string node.
 * @param {StringNode} node The node to print.
 * @returns {string} The string value.
 */
function printString(node) {

    let result = "\"";

    // escape all characters that need escaping
    for (const c of node.value) {

        const newChar = json5CharToEscape.get(c);

        if (newChar) {
            result += "\\" + newChar;
            continue;
        }

        // if it's a double quote, escape it
        if (c === "\"") {
            result += "\\\"";
            continue;
        }

        // if it's a control character, escape it
        if (c < " " || c === "\u007F") {
            const hex = c.codePointAt(0).toString(16).toUpperCase();
            result += `\\u${"0000".substring(hex.length)}${hex}`;
            continue;
        }

        // otherwise, just add the character
        result += c;

    }
    
    return result + "\"";
}

/**
 * Prints the string representation of an identifier node.
 * @param {IdentifierNode} node The node to print.
 * @returns {string} The identifier name.
 */
function printIdentifier(node) {
    return node.name;
}

/**
 * Prints the string representation of an array node.
 * @param {ArrayNode} node The node to print.
 * @param {string} indent The string to use for indentation.
 * @param {number} indentLevel The current level of indentation.
 * @returns {string} The array value.
 */
function printArray(node, indent, indentLevel) {
    const newLine = indent ? "\n" : "";
    const indentString = indent.repeat(indentLevel);
    const elementIndentString = indent.repeat(indentLevel + 1);

    return `[${newLine}${
        node.elements.map(element =>
            `${elementIndentString}${printValue(element.value, indent, indentLevel + 1)}`
        ).join(`,${newLine}`)
    }${newLine}${indentString}]`;
}

/**
 * Prints the string representation of a member node.
 * @param {MemberNode} node The node to print.
 * @param {string} indent The string to use for indentation.
 * @param {number} indentLevel The current level of indentation.
 * @returns {string} The member value.
 */
function printMember(node, indent, indentLevel) {
    const space = indent ? " " : "";
    return `${printValue(node.name, indent, indentLevel)}:${space}${printValue(node.value, indent, indentLevel + 1)}`;
}

/**
 * Prints the string representation of an object node.
 * @param {ObjectNode} node The node to print.
 * @param {string} indent The string to use for indentation.
 * @param {number} indentLevel The current level of indentation.
 * @returns {string} The object value.
 */
function printObject(node, indent, indentLevel) {
    const newLine = indent ? "\n" : "";
    const indentString = indent.repeat(indentLevel);
    const memberIndentString = indent.repeat(indentLevel + 1);

    return `{${newLine}${
        node.members.map(member => 
            `${memberIndentString}${printMember(member, indent, indentLevel)}`
        ).join(`,${newLine}`)
    }${newLine}${indentString}}`;
}

/**
 * Prints the string representation of a node.
 * @param {AnyNode} node The node to print.
 * @param {string} indentString The string to use for indentation.
 * @param {number} indentLevel The current level of indentation.
 * @returns {string} The string representation of the node.
 * @throws {TypeError} If the node type is unknown.

 */
function printValue(node, indentString, indentLevel) {
    switch (node.type) {
        case "String":
            return printString(node);
        case "Number":
            return printNumber(node);
        case "Boolean":
            return printBoolean(node);
        case "Null":
            return printNull();
        case "NaN":
            return printNaN();
        case "Infinity":
            return printInfinity(node);
        case "Identifier":
            return printIdentifier(node);
        case "Array":
            return printArray(node, indentString, indentLevel);
        case "Object":
            return printObject(node, indentString, indentLevel);
        case "Document":
            return printValue(node.body, indentString, indentLevel);
        default:
            throw new TypeError(`Unknown node type: ${node.type}`);
    }
}


//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Converts a Momoa AST back into a JSON string.
 * @param {AnyNode} node The node to print.
 * @param {Object} options Options for the print.
 * @param {number} [options.indent=0] The number of spaces to indent each line. If
 *      greater than 0, then newlines and indents will be added to output. 
 * @returns {string} The JSON representation of the AST.
 */
function print(node, { indent = 0 } = {}) {

    const indentLevel = 0;
    const indentString = " ".repeat(indent);

    return printValue(node, indentString, indentLevel);
}

exports.evaluate = evaluate;
exports.iterator = iterator;
exports.parse = parse;
exports.print = print;
exports.tokenize = tokenize;
exports.traverse = traverse;
exports.types = types;
exports.visitorKeys = childKeys;
