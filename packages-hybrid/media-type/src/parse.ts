import {
    collectCodePointSequence,
    everyCodePointIn,
    toASCIILowerCase,
    skip,
    stripTrailing,
    doesNotMatch,
    SOLIDUS,
    SEMICOLON,
    EQUALS_SIGN,
    QUOTATION_MARK,
    toString,
} from '@nlib/infra';
import {isHTTPWhitespace, collectAnHTTPQuotedString} from '@nlib/fetch';
import {
    isHTTPToken,
    isHTTPQuotedStringToken,
} from './codePoints';
import {Map} from '@nlib/global';
import {ISource, IParameters} from './types';

export const parse = (input: Uint32Array): ISource | null => {
    const {length: inputLength} = input;
    let position = skip(input, 0, isHTTPWhitespace);
    const type = collectCodePointSequence(
        input,
        position,
        doesNotMatch(SOLIDUS),
        (newPosition) => {
            position = newPosition + 1;
        },
    );
    if (type.length === 0 || !everyCodePointIn(type, isHTTPToken) || inputLength <= position) {
        return null;
    }
    const subtype = stripTrailing(
        collectCodePointSequence(
            input,
            position,
            doesNotMatch(SEMICOLON),
            (newPosition) => {
                position = newPosition;
            },
        ),
        isHTTPWhitespace,
    );
    if (subtype.length === 0 || !everyCodePointIn(subtype, isHTTPToken)) {
        return null;
    }
    const parameters: IParameters = new Map();
    const mediaTypeSource: ISource = {
        type: toASCIILowerCase(type),
        subtype: toASCIILowerCase(subtype),
        parameters,
    };
    while (position < inputLength) {
        position = skip(input, position + 1, isHTTPWhitespace);
        const parameterName = toASCIILowerCase(collectCodePointSequence(
            input,
            position,
            doesNotMatch(SEMICOLON, EQUALS_SIGN),
            (newPosition) => {
                position = newPosition;
            },
        ));
        if (position < inputLength && input[position] !== SEMICOLON) {
            position++;
            if (inputLength <= position) {
                break;
            }
            let parameterValue = null;
            if (input[position] === QUOTATION_MARK) {
                parameterValue = collectAnHTTPQuotedString(
                    input,
                    position,
                    true,
                    (newPosition) => {
                        position = newPosition;
                    },
                );
                position = skip(input, position, doesNotMatch(SEMICOLON));
            } else {
                parameterValue = stripTrailing(
                    collectCodePointSequence(
                        input,
                        position,
                        doesNotMatch(SEMICOLON),
                        (newPosition) => {
                            position = newPosition;
                        },
                    ),
                    isHTTPWhitespace,
                );
            }
            const name = toString(parameterName);
            if (
                0 < parameterName.length &&
                everyCodePointIn(parameterName, isHTTPToken) &&
                everyCodePointIn(parameterValue, isHTTPQuotedStringToken) &&
                !parameters.has(name)
            ) {
                parameters.set(name, parameterValue);
            }
        }
    }
    return mediaTypeSource;
};
