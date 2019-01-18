import {CodePoint} from './types';
import {getCodePoints} from './getCodePoints';
import {Uint32Array, Uint8Array} from '@nlib/global';
import {ASCIICodePoint, isASCIINewline, CR, LF, isASCIIWhitespace, SPACE} from './4.5.CodePoints';
import {
    toASCIILowerCase as toASCIILowerCaseCodePoint,
    toASCIIUpperCase as toASCIIUpperCaseCodePoint,
} from './CodePoint';
import {isASCIIByte} from './4.3.Bytes';
import {isomorphicDecode} from './4.4.ByteSequences';

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

export const slice = (input: ScalarValueString, from: number = 0, to: number = input.length): ScalarValueString => {
    return new ScalarValueString(input.array.slice(from, to));
};

export const map = (input: ScalarValueString, callback: (codePoint: CodePoint, index: number, self: typeof input) => CodePoint): ScalarValueString => {
    return new ScalarValueString(input.array.map((codePoint, index) => callback(codePoint as CodePoint, index, input)));
};

export const every = (input: ScalarValueString, callback: (codePoint: CodePoint, index: number, self: typeof input) => boolean): boolean => {
    return input.array.every((codePoint, index) => callback(codePoint as CodePoint, index, input));
};

export const some = (input: ScalarValueString, callback: (codePoint: CodePoint, index: number, self: typeof input) => boolean): boolean => {
    return input.array.some((codePoint, index) => callback(codePoint as CodePoint, index, input));
};

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
                position += 1;
            }
            codePoint = LF;
        }
        normalized[normalizedLength++] = codePoint;
    }
    return new ScalarValueString(normalized.slice(0, normalizedLength));
};

export const getNonASCIIWhitespaceRange = (input: ScalarValueString): [number, number] => {
    let start = 0;
    while (isASCIIWhitespace(input.get(start))) {
        start += 1;
    }
    let end = input.length - 1;
    while (start < end && isASCIIWhitespace(input.get(end))) {
        end -= 1;
    }
    return [start, end + 1];
};

export const stripLeadingAndTrailingASCIIWhitespace = (input: ScalarValueString): ScalarValueString => {
    const [start, end] = getNonASCIIWhitespaceRange(input);
    return slice(input, start, end);
};

export type CodePointCondition = (codePoint: CodePoint) => boolean;

export const collectCodePointSequence = (input: ScalarValueString, position: number, condition: CodePointCondition): [ScalarValueString, number] => {
    const collected = input.array;
    let collectedLength = 0;
    let newPosition = position;
    const {length} = input;
    while (newPosition < length) {
        const codePoint = input.get(newPosition);
        if (condition(codePoint)) {
            collected[collectedLength++] = codePoint;
            newPosition += 1;
        } else {
            break;
        }
    }
    return [new ScalarValueString(collected.slice(0, collectedLength)), newPosition];
};

export const skipASCIIWhitespace = (input: ScalarValueString, position: number): number => {
    const {length} = input;
    let newPosition = position;
    while (newPosition < length) {
        if (isASCIIWhitespace(input.get(newPosition))) {
            newPosition += 1;
        } else {
            break;
        }
    }
    return newPosition;
};

export const stripAndCollapseASCIIWhiteSpace = (input: ScalarValueString): ScalarValueString => {
    const collapsed = input.array;
    const [start, end] = getNonASCIIWhitespaceRange(input);
    let collapsedLength = 0;
    for (let position = start; position < end; position++) {
        let codePoint = input.get(position);
        if (isASCIIWhitespace(codePoint)) {
            position = skipASCIIWhitespace(input, position) - 1;
            codePoint = SPACE;
        }
        collapsed[collapsedLength++] = codePoint;
    }
    return new ScalarValueString(collapsed.slice(0, collapsedLength));
};
