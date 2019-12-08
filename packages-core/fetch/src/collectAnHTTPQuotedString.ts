import {NlibError} from '@nlib/util';
import {
    fromString,
    concatenate,
    collectCodePointSequence,
    doesNotMatch,
    fromCodePoint,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
} from '@nlib/infra';

export const collectAnHTTPQuotedString = (
    input: Uint32Array,
    position: number,
    extractValue: boolean,
    positionCallback?: (position: number) => void,
): Uint32Array => {
    const {length: inputLength} = input;
    const positionStart = position;
    let value = fromString('');
    if (input[position] !== QUOTATION_MARK) {
        throw new NlibError({
            code: 'EInvalidCharacter',
            message: `${input.slice(position)} doesn't start with QUOTATION_MARK (")`,
            data: input,
        });
    }
    position++;
    while (1) {
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
        const quoteOrBackslash = input[position++];
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
            throw new NlibError({
                code: 'EInvalidCharacter',
                message: `Invalid end: ${input}`,
                data: input,
            });
        }
    }
    if (positionCallback) {
        positionCallback(position);
    }
    if (extractValue) {
        return value;
    }
    return input.slice(positionStart, position);
};
