import {Uint32Array, Uint8Array, String} from '@nlib/global';
import {CodePoint} from './types';
import {getCodePoints} from './getCodePoints';
import {
    ASCIICodePoint,
    isASCIINewline,
    isASCIIWhitespace,
    isASCIINonNewlineWhitespace,
} from './4.5.CodePoints';
import {
    toASCIILowerCase as toASCIILowerCaseCodePoint,
    toASCIIUpperCase as toASCIIUpperCaseCodePoint,
} from './CodePoint';
import {isASCIIByte} from './4.3.Bytes';
import {isomorphicDecode} from './4.4.ByteSequences';
const LF = 0x000A as CodePoint;
const CR = 0x000D as CodePoint;
const SPACE = 0x0020 as CodePoint;
const COMMA = 0x002C as CodePoint;


export class ScalarValueString implements Iterable<CodePoint> {

    private readonly codePoints: Uint32Array

    public constructor(codePoints: Uint32Array) {
        this.codePoints = codePoints;
    }

    public* iterator(): IterableIterator<CodePoint> {
        for (const codePoint of this.codePoints) {
            yield codePoint as CodePoint;
        }
    }

    public [Symbol.iterator](): IterableIterator<CodePoint> {
        return this.iterator();
    }

    public get length(): number {
        return this.codePoints.length;
    }

    public get(index: number): CodePoint {
        return this.codePoints[index] as CodePoint;
    }

    public get array(): Uint32Array {
        return this.codePoints.slice();
    }

    public toString(): string {
        return String.fromCodePoint(...this);
    }

}

export const fromString = (input: string): ScalarValueString => {
    return new ScalarValueString(Uint32Array.from(getCodePoints(input)));
};

export const fromIterable = (input: Iterable<number> | Iterable<CodePoint>): ScalarValueString => {
    return new ScalarValueString(Uint32Array.from(input));
};

export const equal = (s1: ScalarValueString, s2: ScalarValueString): boolean => {
    const {length} = s1;
    if (length !== s2.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (s1.get(i) !== s2.get(i)) {
            return false;
        }
    }
    return true;
};

export const caseInsensitiveMatch = (s1: ScalarValueString, s2: ScalarValueString): boolean => {
    const {length} = s1;
    if (length !== s2.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (toASCIILowerCaseCodePoint(s1.get(i)) !== toASCIILowerCaseCodePoint(s2.get(i))) {
            return false;
        }
    }
    return true;
};

export const slice = (
    input: ScalarValueString,
    from: number = 0,
    to: number = input.length,
): ScalarValueString => new ScalarValueString(input.array.slice(from, to));

export const map = (
    input: ScalarValueString,
    callback: (codePoint: CodePoint, index: number, self: typeof input) => CodePoint,
): ScalarValueString => new ScalarValueString(input.array.map((codePoint, index) => callback(codePoint as CodePoint, index, input)));

export const every = (
    input: ScalarValueString,
    callback: (codePoint: CodePoint, index: number, self: typeof input) => boolean,
): boolean => input.array.every((codePoint, index) => callback(codePoint as CodePoint, index, input));

export const some = (
    input: ScalarValueString,
    callback: (codePoint: CodePoint, index: number, self: typeof input) => boolean,
): boolean => input.array.some((codePoint, index) => callback(codePoint as CodePoint, index, input));

export const isomorphicEncode = (input: ScalarValueString): Uint8Array => {
    const {length} = input;
    const encoded = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        const codePoint = input.get(i);
        if (0x00FF < codePoint) {
            throw new Error(`The codepoint is greater then 0x00FF: ${codePoint}`);
        }
        encoded[i] = codePoint;
    }
    return encoded;
};

export const isASCIIString = (input: ScalarValueString): boolean => every(input, (codePoint) => ASCIICodePoint.has(codePoint));

export const toASCIILowerCase = (input: ScalarValueString): ScalarValueString => map(input, toASCIILowerCaseCodePoint);

export const toASCIIUpperCase = (input: ScalarValueString): ScalarValueString => map(input, toASCIIUpperCaseCodePoint);

export const encodeASCII = (input: ScalarValueString): Uint8Array => {
    if (!isASCIIString(input)) {
        throw new Error(`The input is not an ASCII string: ${input}`);
    }
    return isomorphicEncode(input);
};

export const decodeASCII = (input: Uint8Array): ScalarValueString => {
    for (const byte of input) {
        if (!isASCIIByte(byte)) {
            throw new Error(`The input has a non-ASCII byte: ${byte}`);
        }
    }
    return isomorphicDecode(input);
};

export const stripNewlines = (input: ScalarValueString): ScalarValueString => new ScalarValueString(input.array.filter((codePoint) => !isASCIINewline(codePoint)));

export const normalizeNewlines = (input: ScalarValueString): ScalarValueString => {
    const normalized = input.array;
    const {length} = normalized;
    let normalizedLength = 0;
    for (let position = 0; position < length; position++) {
        let codePoint = input.get(position);
        if (codePoint === CR) {
            if (input.get(position + 1) === LF) {
                position++;
            }
            codePoint = LF;
        }
        normalized[normalizedLength++] = codePoint;
    }
    return new ScalarValueString(normalized.slice(0, normalizedLength));
};

export type CodePointCondition = (codePoint: CodePoint) => boolean;

export const collectCodePoint = function* (
    input: ScalarValueString,
    from: number,
    condition: CodePointCondition,
): IterableIterator<CodePoint> {
    let position = from;
    const {length} = input;
    while (position < length) {
        const codePoint = input.get(position);
        if (condition(codePoint)) {
            yield codePoint;
            position++;
        } else {
            break;
        }
    }
};

export const collectCodePointRight = function* (
    input: ScalarValueString,
    from: number,
    condition: CodePointCondition,
): IterableIterator<CodePoint> {
    let position = from;
    while (0 < position) {
        const codePoint = input.get(position - 1);
        if (condition(codePoint)) {
            yield codePoint;
            position--;
        } else {
            break;
        }
    }
};

export const collectCodePointSequence = (
    input: ScalarValueString,
    position: number,
    condition: CodePointCondition,
    positionCallback: (position: number) => void = () => {},
): ScalarValueString => {
    const {array: collected} = input;
    let length = 0;
    for (const codePoint of collectCodePoint(input, position, condition)) {
        collected[length++] = codePoint;
    }
    positionCallback(position + length);
    return new ScalarValueString(collected.slice(0, length));
};

export const skipASCIINonNewlineWhitespace = (input: ScalarValueString, position: number): number => {
    const iterator = collectCodePoint(input, position, isASCIINonNewlineWhitespace);
    let length = 0;
    while (!iterator.next().done) {
        length++;
    }
    return position + length;
};

export const skipASCIIWhitespace = (input: ScalarValueString, position: number): number => {
    const iterator = collectCodePoint(input, position, isASCIIWhitespace);
    let length = 0;
    while (!iterator.next().done) {
        length++;
    }
    return position + length;
};

export const skipASCIIWhitespaceRight = (input: ScalarValueString, position: number): number => {
    const iterator = collectCodePointRight(input, position, isASCIIWhitespace);
    let length = 0;
    while (!iterator.next().done) {
        length++;
    }
    return position - length;
};

export const stripLeadingAndTrailingASCIIWhitespace = (input: ScalarValueString): ScalarValueString => slice(
    input,
    skipASCIIWhitespace(input, 0),
    skipASCIIWhitespaceRight(input, input.length),
);

export const stripAndCollapseASCIIWhiteSpace = (input: ScalarValueString): ScalarValueString => {
    const {array: collapsed, length} = input;
    let collapsedLength = 0;
    let position = skipASCIIWhitespace(input, 0);
    let spaceFlag = false;
    while (position < length) {
        const codePoint = input.get(position);
        if (isASCIIWhitespace(codePoint)) {
            spaceFlag = true;
            position = skipASCIIWhitespace(input, position);
        } else {
            if (spaceFlag) {
                collapsed[collapsedLength++] = SPACE;
            }
            collapsed[collapsedLength++] = codePoint;
            position++;
        }
    }
    return new ScalarValueString(collapsed.slice(0, collapsedLength));
};

export const split = function* (input: ScalarValueString, condition: CodePointCondition): IterableIterator<ScalarValueString> {
    const {array: token} = input;
    let tokenLength = 0;
    for (const codePoint of input) {
        if (condition(codePoint)) {
            yield new ScalarValueString(token.slice(0, tokenLength));
            tokenLength = 0;
        } else {
            token[tokenLength++] = codePoint;
        }
    }
    yield new ScalarValueString(token.slice(0, tokenLength));
};

export const strictlySplit = (input: ScalarValueString, delimiter: CodePoint): IterableIterator<ScalarValueString> => split(input, (codePoint) => codePoint === delimiter);

export const splitOn = function* (input: ScalarValueString, condition: CodePointCondition): IterableIterator<ScalarValueString> {
    const {length} = input;
    let position = 0;
    while (position < length) {
        position = skipASCIIWhitespace(input, position);
        const {array: collected} = input;
        let collectedLength = 0;
        let whiteSpaceLength = 0;
        for (const codePoint of collectCodePoint(input, position, (codePoint) => !condition(codePoint))) {
            collected[collectedLength++] = codePoint;
            if (isASCIIWhitespace(codePoint)) {
                whiteSpaceLength++;
            } else {
                whiteSpaceLength = 0;
            }
            position++;
        }
        yield new ScalarValueString(collected.slice(0, collectedLength - whiteSpaceLength));
        position++;
    }
};

export const splitOnASCIIWhitespace = function* (input: ScalarValueString): IterableIterator<ScalarValueString> {
    for (const collected of splitOn(input, isASCIIWhitespace)) {
        if (0 < collected.length) {
            yield collected;
        }
    }
};

export const splitOnComma = (input: ScalarValueString): IterableIterator<ScalarValueString> => splitOn(input, (codePoint) => codePoint === COMMA);

export const concatenate = (...args: Array<ScalarValueString>): ScalarValueString => {
    const concatenated = new Uint32Array(args.reduce((sum, string) => sum + string.length, 0));
    let position = 0;
    for (const string of args) {
        for (const codePoint of string) {
            concatenated[position++] = codePoint;
        }
    }
    return new ScalarValueString(concatenated);
};
