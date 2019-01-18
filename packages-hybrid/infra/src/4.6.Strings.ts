import {Error, Uint8Array} from '@nlib/global';
import {isASCIICodePoint, isASCIIUpperAlpha, isASCIILowerAlpha, isASCIINewline, CR, LF, isASCIIWhitespace, SPACE} from './4.5.CodePoints';
import {ScalarValueString, CodePoint} from './types';
import {isASCIIByte} from './4.3.Bytes';
import {isomorphicDecode} from './4.4.ByteSequences';

export const isomorphicEncode = (input: ScalarValueString): Uint8Array => {
    const codePoints: Array<number> = [];
    for (const codePoint of input) {
        if (0x00FF < codePoint) {
            throw new Error(`The codepoint is greater then 0x00FF: ${codePoint}`);
        }
        codePoints.push(codePoint);
    }
    return Uint8Array.from(codePoints);
};

export const isASCIIString = (input: ScalarValueString): boolean => {
    for (const codePoint of input) {
        if (!isASCIICodePoint(codePoint)) {
            return false;
        }
    }
    return true;
};

export const toASCIILowerCase = (input: ScalarValueString): ScalarValueString => {
    const result = input.slice();
    for (let i = 0; i < input.length; i++) {
        const codePoint = input[i];
        if (isASCIIUpperAlpha(codePoint)) {
            result[i] = (codePoint + 0x20) as CodePoint;
        }
    }
    return result;
};

export const toASCIIUpperCase = (input: ScalarValueString): ScalarValueString => {
    const result = input.slice();
    for (let i = 0; i < input.length; i++) {
        const codePoint = input[i];
        if (isASCIILowerAlpha(codePoint)) {
            result[i] = (codePoint - 0x20) as CodePoint;
        }
    }
    return result;
};

export const caseInsensitiveMatch = (input1: ScalarValueString, input2: ScalarValueString): boolean => {
    const {length} = input1;
    if (length !== input2.length) {
        return false;
    }
    const caseInsensitiveByteSequence1 = toASCIILowerCase(input1);
    const caseInsensitiveByteSequence2 = toASCIILowerCase(input2);
    for (let i = 0; i < length; i++) {
        if (caseInsensitiveByteSequence1[i] !== caseInsensitiveByteSequence2[i]) {
            return false;
        }
    }
    return true;
};

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

/** Mutates its input */
export const _stripNewlines = (input: ScalarValueString): ScalarValueString => {
    let i = input.length;
    while (0 < --i) {
        if (isASCIINewline(input[i])) {
            input.splice(i, 1);
        }
    }
    return input;
};

export const stripNewlines = (input: ScalarValueString): ScalarValueString => _stripNewlines(input.slice());

/** Mutates its input */
export const _normalizeNewlines = (input: ScalarValueString): ScalarValueString => {
    let i = input.length;
    while (0 < --i) {
        const codePoint = input[i];
        if (codePoint === CR) {
            input[i] = LF;
        } else if (codePoint === LF && input[i - 1] === CR) {
            input.splice(i - 1, 2, LF);
            i -= 1;
        }
    }
    return input;
};

export const normalizeNewlines = (input: ScalarValueString): ScalarValueString => _normalizeNewlines(input.slice());

/** Mutates its input */
export const _stripLeadingASCIIWhitespace = (input: ScalarValueString): ScalarValueString => {
    while (isASCIIWhitespace(input[0])) {
        input.shift();
    }
    return input;
};

/** Mutates its input */
export const _stripTrailingASCIIWhitespace = (input: ScalarValueString): ScalarValueString => {
    while (isASCIIWhitespace(input[input.length - 1])) {
        input.pop();
    }
    return input;
};

export const stripLeadingAndTrailingASCIIWhitespace = (input: ScalarValueString): ScalarValueString => _stripLeadingASCIIWhitespace(_stripTrailingASCIIWhitespace(input.slice()));

/** Mutates its input */
export const _collapseASCIIWhiteSpace = (input: ScalarValueString): ScalarValueString => {
    let i = input.length;
    while (0 < --i) {
        if (isASCIIWhitespace(input[i])) {
            let length = 1;
            while (isASCIIWhitespace(input[i - length])) {
                length += 1;
            }
            i = i - length + 1;
            input.splice(i, length, SPACE);
        }
    }
    return input;
};

export const stripAndCollapseASCIIWhiteSpace = (input: ScalarValueString): ScalarValueString => _collapseASCIIWhiteSpace(_stripLeadingASCIIWhitespace(_stripTrailingASCIIWhitespace(input.slice())));

export type CodePointCondition = (codePoint: CodePoint) => boolean;

export const collectCodePointSequence = (input: ScalarValueString, position: number, condition: CodePointCondition): [ScalarValueString, number] => {
    const result: ScalarValueString = [];
    const {length} = input;
    while (position < length) {
        const codePoint = input[position];
        if (condition(codePoint)) {
            result.push(codePoint);
            position += 1;
        } else {
            break;
        }
    }
    return [result, position];
};

export const skipASCIIWhitespace = (input: ScalarValueString, position: number): number => collectCodePointSequence(input, position, isASCIIWhitespace)[1];
