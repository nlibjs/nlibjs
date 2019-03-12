import {Error} from '@nlib/global';
import {collectCodePointSequence} from './4.6.Strings';
import {PositionCallback} from './types';
import {isASCIIDigit, DIGIT_ZERO} from './4.5.CodePoints';

export const parseDecimalInteger = (
    input: Uint32Array,
    from: number,
    positionCallBack?: PositionCallback,
): number => {
    let position = from;
    const digits = collectCodePointSequence(input, from, isASCIIDigit, (newPosition) => {
        position = newPosition;
    });
    if (digits.length === 0) {
        throw new Error('No digits');
    }
    const firstDigit = digits[0];
    if (firstDigit === DIGIT_ZERO && digits[1] === DIGIT_ZERO) {
        throw new Error(`The decimal starts with 00: ${digits}`);
    }
    if (positionCallBack) {
        positionCallBack(position);
    }
    let sum = 0;
    let order = 1;
    for (let index = digits.length; index--;) {
        sum += (digits[index] - DIGIT_ZERO) * order;
        order *= 10;
    }
    return sum;
};
