import {Infinity} from '@nlib/global';
import {
    PositionCallback,
    isASCIIDigit,
    parseDecimalInteger,
    ASTERISK,
} from '@nlib/infra';
import {IntervalZ} from '@nlib/real-number';

export const parseMax = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): number => isASCIIDigit(input[from]) ? parseDecimalInteger(input, from, positionCallback) : Infinity;

export const parseRepeat = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): IntervalZ => {
    let position = from;
    let min = 1;
    let max = 1;
    if (input[position] === ASTERISK) {
        min = 0;
        position++;
        max = parseMax(input, position, (newPosition) => {
            position = newPosition;
        });
    } else if (isASCIIDigit(input[position])) {
        min = parseDecimalInteger(input, position, (newPosition) => {
            position = newPosition;
        });
        if (input[position] === ASTERISK) {
            if (++position < input.length && isASCIIDigit(input[position])) {
                max = parseMax(input, position, (newPosition) => {
                    position = newPosition;
                });
            } else {
                max = Infinity;
            }
        } else {
            max = min;
        }
    }
    positionCallback(position);
    return [min, max];
};
