import {Error} from '@nlib/global';
import {
    ScalarValueString,
    fromString,
    slice,
    concatenate,
    collectCodePointSequence,
    doesNotMatch,
    fromCodePoint,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
} from '@nlib/infra';

export const collectAnHTTPQuotedString = (
    input: ScalarValueString,
    position: number,
    extractValue: boolean,
    positionCallback: (position: number) => void = () => {},
): ScalarValueString => {
    const {length: inputLength} = input;
    const positionStart = position;
    let value = fromString('');
    if (input.get(position) !== QUOTATION_MARK) {
        throw new Error(`${slice(input, position)} doesn't start with QUOTATION_MARK (")`);
    }
    position++;
    while (true) {
        value = concatenate(
            value,
            collectCodePointSequence(
                input,
                position,
                doesNotMatch(QUOTATION_MARK, REVERSE_SOLIDUS),
                (newPosition) => {
                    position = newPosition;
                },
            ),
        );
        if (inputLength <= position) {
            break;
        }
        const quoteOrBackslash = input.get(position++);
        if (quoteOrBackslash === REVERSE_SOLIDUS) {
            if (inputLength <= position) {
                value = concatenate(value, fromCodePoint(REVERSE_SOLIDUS));
                break;
            }
            value = concatenate(value, fromCodePoint(REVERSE_SOLIDUS));
            position++;
        } else if (quoteOrBackslash === QUOTATION_MARK) {
            break;
        } else {
            throw new Error(`Invalid end: ${input}`);
        }
    }
    positionCallback(position);
    if (extractValue) {
        return value;
    }
    return slice(input, positionStart, position);
};
