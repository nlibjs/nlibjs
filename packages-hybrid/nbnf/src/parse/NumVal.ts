import {NlibError} from '@nlib/util';
import {String} from '@nlib/global';
import {
    PositionCallback,
    PERCENT_SIGN,
    FULL_STOP,
    fromIterable,
    HYPHEN_MINUS,
    fromCodePoint,
} from '@nlib/infra';
import {
    radixes,
    parseDigits,
} from './Digits';
import {
    NBNFElementType,
    INBNFSequenceElement,
    INBNFCodePointElement,
} from '../types';

export const parseNumVal = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFSequenceElement | INBNFCodePointElement => {
    let position = from;
    const updatePosition: PositionCallback = (newPosition): void => {
        position = newPosition;
    };
    if (input[position] === PERCENT_SIGN) {
        position++;
    } else {
        throw new NlibError({
            code: 'nbnf/parseNumVal/1',
            message: 'Parsing error: PERCENT_SIGN expected at left end',
            data: {input, from},
        });
    }
    const radix = radixes[input[position]];
    if (radix) {
        position++;
    } else {
        throw new NlibError({
            code: 'nbnf/parseNumVal/2',
            message: `Parsing error: invalid radix indicator ${String.fromCodePoint(input[position])}`,
            data: {input, from},
        });
    }
    const number1 = parseDigits(input, position, radix, updatePosition);
    let result: INBNFSequenceElement | INBNFCodePointElement;
    switch (input[position]) {
    case FULL_STOP: {
        const codePoints: Array<number> = [number1];
        while (input[position] === FULL_STOP) {
            position++;
            codePoints.push(parseDigits(input, position, radix, updatePosition));
        }
        result = {type: NBNFElementType.Sequence, data: fromIterable(codePoints), caseSensitive: true};
        break;
    }
    case HYPHEN_MINUS:
        result = {type: NBNFElementType.CodePoint, data: [[number1, parseDigits(input, position + 1, radix, updatePosition)]]};
        break;
    default:
        result = {type: NBNFElementType.Sequence, data: fromCodePoint(number1), caseSensitive: true};
    }
    positionCallback(position);
    return result;
};
