import {CustomError} from '@nlib/util';
import {collectCodePointSequence} from './4.6.Strings';
import {PositionCallback} from './types';
import {
    isASCIIDigit,
    DIGIT_ZERO,
} from './4.5.CodePoints';

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
        throw new CustomError({
            code: 'ENoDigits',
            message: 'No digits',
            data: input,
        });
    }
    const firstDigit = digits[0];
    if (firstDigit === DIGIT_ZERO && digits[1] === DIGIT_ZERO) {
        throw new CustomError({
            code: 'EZeroPrefix',
            message: `The decimal starts with 00: ${digits}`,
            data: input,
        });
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
