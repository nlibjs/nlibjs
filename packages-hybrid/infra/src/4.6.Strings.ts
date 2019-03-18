import {
    Uint32Array,
    Uint8Array,
    Set,
    Math,
    String,
} from '@nlib/global';
import {NlibError} from '@nlib/util';
import {
    PositionCallback,
    CodePointCondition,
    CodePointMappingFunction,
} from './types';
import {getCodePoints} from './getCodePoints';
import {
    CARRIAGE_RETURN,
    LINE_FEED,
    SPACE,
    isASCIINewline,
    isASCIIWhitespace,
    isASCIICodePoint,
    isASCIIUpperAlpha,
    isASCIILowerAlpha,
} from './4.5.CodePoints';
import {isASCIIByte} from './4.3.Bytes';
import {isomorphicDecode} from './4.4.ByteSequences';

export const toASCIILowerCaseCodePoint: CodePointMappingFunction = (codePoint: number): number => isASCIIUpperAlpha(codePoint) ? codePoint + 0x20 as number : codePoint;

export const toASCIIUpperCaseCodePoint: CodePointMappingFunction = (codePoint: number): number => isASCIILowerAlpha(codePoint) ? codePoint - 0x20 as number : codePoint;

export const fromString = (input: string): Uint32Array => Uint32Array.from(getCodePoints(input)) as Uint32Array;

export const toScalarValueString = (input: string | Uint32Array): Uint32Array => typeof input === 'string' ? fromString(input) : input;

export const fromIterable = (input: Iterable<number> | Iterable<number>): Uint32Array => Uint32Array.from(input) as Uint32Array;

export const fromCodePoint = (...input: Array<number>): Uint32Array => Uint32Array.from(input) as Uint32Array;

export const toString = (input: Iterable<number>): string => String.fromCodePoint(...input);

export const leftEqual = (s1: Uint32Array, s2: Uint32Array): boolean => {
    const length = Math.min(s1.length, s2.length);
    for (let i = 0; i < length; i++) {
        if (s1[i] !== s2[i]) {
            return false;
        }
    }
    return true;
};

export const rightEqual = (s1: Uint32Array, s2: Uint32Array): boolean => {
    const {length: length1} = s1;
    const {length: length2} = s2;
    const length = Math.min(length1, length2);
    for (let i = 0; i < length; i++) {
        if (s1[length1 - i - 1] !== s2[length2 - i - 1]) {
            return false;
        }
    }
    return true;
};

export const equal = (s1: Uint32Array, s2: Uint32Array): boolean => s1.length === s2.length && leftEqual(s1, s2);

export const caseInsensitiveMatch = (s1: Uint32Array, s2: Uint32Array): boolean => {
    const {length} = s1;
    if (length !== s2.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (toASCIILowerCaseCodePoint(s1[i]) !== toASCIILowerCaseCodePoint(s2[i])) {
            return false;
        }
    }
    return true;
};

export const matches = (...targetList: Array<number>): CodePointCondition => {
    const targets = new Set<number>(targetList);
    return (codePoint: number) => targets.has(codePoint);
};

export const doesNotMatch = (...targetList: Array<number>): CodePointCondition => {
    const targets = new Set<number>(targetList);
    return (codePoint: number) => !targets.has(codePoint);
};

export const everyCodePointIn = (
    input: Uint32Array,
    callback: (codePoint: number, index: number, self: typeof input) => boolean,
): boolean => input.every((codePoint, index) => callback(codePoint, index, input));

export const atLeastOneCodePointIn = (
    input: Uint32Array,
    callback: (codePoint: number, index: number, self: typeof input) => boolean,
): boolean => input.some((codePoint, index) => callback(codePoint, index, input));

export const isomorphicEncode = (input: Uint32Array): Uint8Array => {
    const {length} = input;
    const encoded = new Uint8Array(length);
    for (let index = 0; index < length; index++) {
        const codePoint = input[index];
        if (0x00FF < codePoint) {
            throw new NlibError({
                code: 'ERange',
                message: `The codepoint at ${index} is greater then 0x00FF: ${codePoint}`,
                data: input,
            });
        }
        encoded[index] = codePoint;
    }
    return encoded;
};

export const isASCIIString = (input: Uint32Array): boolean => everyCodePointIn(input, isASCIICodePoint);

export const toASCIILowerCase = (input: Uint32Array): Uint32Array => input.map(toASCIILowerCaseCodePoint);

export const toASCIIUpperCase = (input: Uint32Array): Uint32Array => input.map(toASCIIUpperCaseCodePoint);

export const encodeASCII = (input: Uint32Array): Uint8Array => {
    if (!isASCIIString(input)) {
        throw new NlibError({
            code: 'ENonASCII',
            message: `The input is not an ASCII string: ${input}`,
            data: input,
        });
    }
    return isomorphicEncode(input);
};

export const decodeASCII = (input: Uint8Array): Uint32Array => {
    for (const byte of input) {
        if (!isASCIIByte(byte)) {
            throw new NlibError({
                code: 'ENonASCII',
                message: `The input has a non-ASCII byte: ${byte}`,
                data: input,
            });
        }
    }
    return isomorphicDecode(input);
};

export const stripNewlines = (input: Uint32Array): Uint32Array => input.filter((codePoint) => !isASCIINewline(codePoint));

export const normalizeNewlines = (input: Uint32Array): Uint32Array => {
    const normalized = input.slice();
    const {length} = normalized;
    let normalizedLength = 0;
    for (let position = 0; position < length; position++) {
        let codePoint = input[position];
        if (codePoint === CARRIAGE_RETURN) {
            if (input[position + 1] === LINE_FEED) {
                position++;
            }
            codePoint = LINE_FEED;
        }
        normalized[normalizedLength++] = codePoint;
    }
    return normalized.slice(0, normalizedLength);
};

export const collectCodePoint = function* (
    input: Uint32Array,
    from: number,
    condition: CodePointCondition,
): IterableIterator<number> {
    let position = from;
    const {length} = input;
    while (position < length) {
        const codePoint = input[position];
        if (condition(codePoint)) {
            yield codePoint;
            position++;
        } else {
            break;
        }
    }
};

export const collectCodePointRight = function* (
    input: Uint32Array,
    from: number,
    condition: CodePointCondition,
): IterableIterator<number> {
    let position = from;
    while (0 < position) {
        const codePoint = input[position - 1];
        if (condition(codePoint)) {
            yield codePoint;
            position--;
        } else {
            break;
        }
    }
};

export const collectCodePointSequence = (
    input: Uint32Array,
    position: number,
    condition: CodePointCondition,
    positionCallback?: PositionCallback,
): Uint32Array => {
    const collected = input.slice();
    let length = 0;
    for (const codePoint of collectCodePoint(input, position, condition)) {
        collected[length++] = codePoint;
    }
    if (positionCallback) {
        positionCallback(position + length);
    }
    return collected.slice(0, length);
};

export const skip = (input: Uint32Array, position: number, condition: CodePointCondition): number => {
    const iterator = collectCodePoint(input, position, condition);
    let length = 0;
    while (!iterator.next().done) {
        length++;
    }
    return position + length;
};

export const skipRight = (input: Uint32Array, position: number, condition: CodePointCondition): number => {
    const iterator = collectCodePointRight(input, position, condition);
    let length = 0;
    while (!iterator.next().done) {
        length++;
    }
    return position - length;
};

export const stripLeading = (input: Uint32Array, condition: CodePointCondition): Uint32Array => input.slice(skip(input, 0, condition));
export const stripTrailing = (input: Uint32Array, condition: CodePointCondition): Uint32Array => input.slice(0, skipRight(input, input.length, condition));
export const stripLeadingAndTrailing = (input: Uint32Array, condition: CodePointCondition): Uint32Array => input.slice(skip(input, 0, condition), skipRight(input, input.length, condition));

export const stripAndCollapseASCIIWhiteSpace = (input: Uint32Array): Uint32Array => {
    const collapsed = input.slice();
    const {length} = input;
    let collapsedLength = 0;
    let position = skip(input, 0, isASCIIWhitespace);
    let spaceFlag = false;
    while (position < length) {
        const codePoint = input[position];
        if (isASCIIWhitespace(codePoint)) {
            spaceFlag = true;
            position = skip(input, position, isASCIIWhitespace);
        } else {
            if (spaceFlag) {
                collapsed[collapsedLength++] = SPACE;
            }
            collapsed[collapsedLength++] = codePoint;
            position++;
        }
    }
    return collapsed.slice(0, collapsedLength);
};

export const split = function* (input: Uint32Array, condition: CodePointCondition): IterableIterator<Uint32Array> {
    const token = input.slice();
    let tokenLength = 0;
    for (const codePoint of input) {
        if (condition(codePoint)) {
            yield token.slice(0, tokenLength);
            tokenLength = 0;
        } else {
            token[tokenLength++] = codePoint;
        }
    }
    yield token.slice(0, tokenLength);
};

export const strictlySplit = (input: Uint32Array, delimiter: number): IterableIterator<Uint32Array> => split(input, matches(delimiter));

export const splitOn = function* (input: Uint32Array, condition: CodePointCondition): IterableIterator<Uint32Array> {
    const {length} = input;
    let position = 0;
    while (position < length) {
        position = skip(input, position, isASCIIWhitespace);
        const collected = input.slice();
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
        yield collected.slice(0, collectedLength - whiteSpaceLength);
        position++;
    }
};

export const splitOnASCIIWhitespace = function* (input: Uint32Array): IterableIterator<Uint32Array> {
    for (const collected of splitOn(input, isASCIIWhitespace)) {
        if (0 < collected.length) {
            yield collected;
        }
    }
};

export const concatenate = (...args: Array<Uint32Array>): Uint32Array => {
    const concatenated = new Uint32Array(args.reduce((sum, string) => sum + string.length, 0));
    let position = 0;
    for (const string of args) {
        for (const codePoint of string) {
            concatenated[position++] = codePoint;
        }
    }
    return concatenated;
};
