import {NlibError} from '@nlib/util';
import {
    CodePointCondition,
    PositionCallback,
    collectCodePointSequence,
    DIGIT_ZERO,
    DIGIT_NINE,
    LATIN_SMALL_LETTER_A,
    LATIN_SMALL_LETTER_B,
    LATIN_SMALL_LETTER_D,
    isASCIIDigit,
    LATIN_SMALL_LETTER_X,
    isASCIIUpperHexDigit,
    toASCIILowerCase,
} from '@nlib/infra';
import {isBIT} from '../codePoints';

export interface IRadixData {
    condition: CodePointCondition,
    filter: (input: Uint32Array) => number,
}

export interface IRadixMap {
    [key: number]: IRadixData,
}

export const parseBinLiteral = (input: Uint32Array): number => input.reduce((sum, value) => (sum << 1) | (value - DIGIT_ZERO), 0);
export const parseDecLiteral = (input: Uint32Array): number => input.reduce((sum, value) => sum * 10 + (value - DIGIT_ZERO), 0);
export const parseHexLiteral = (input: Uint32Array): number => toASCIILowerCase(input).reduce((sum, value) => (sum << 4) | (DIGIT_NINE < value ? 10 + value - LATIN_SMALL_LETTER_A : value - DIGIT_ZERO), 0);

export const radixes: IRadixMap = {
    [LATIN_SMALL_LETTER_B]: {condition: isBIT, filter: parseBinLiteral},
    [LATIN_SMALL_LETTER_D]: {condition: isASCIIDigit, filter: parseDecLiteral},
    [LATIN_SMALL_LETTER_X]: {condition: isASCIIUpperHexDigit, filter: parseHexLiteral},
};

export const parseDigits = (
    input: Uint32Array,
    from: number,
    radix: IRadixData,
    positionCallback: PositionCallback,
): number => {
    let position = from;
    const digits = collectCodePointSequence(input, position, radix.condition, (newPosition) => {
        position = newPosition;
    });
    if (digits.length === 0) {
        throw new NlibError({
            code: 'nbnf/parseDigits/1',
            message: 'Parsing error: digits is empty',
            data: {input, from},
        });
    }
    positionCallback(position);
    return radix.filter(digits);
};
