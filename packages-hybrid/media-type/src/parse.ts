import {
    ScalarValueString,
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
} from '@nlib/infra';
import {isHTTPWhitespace, collectAnHTTPQuotedString} from '@nlib/fetch';
import {
    isHTTPToken,
    isHTTPQuotedStringToken,
} from './codePoints';
import {mediatype} from './types';
import {Map} from '@nlib/global';
import {MediaType} from './MediaType';

export const parse = (input: ScalarValueString): MediaType | null => {
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
    if (type.isEmpty || !everyCodePointIn(type, isHTTPToken) || inputLength <= position) {
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
    if (subtype.isEmpty || !everyCodePointIn(subtype, isHTTPToken)) {
        return null;
    }
    const parameters: mediatype.IParameters = new Map();
    const mediaTypeSource: mediatype.ISource = {
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
        if (position < inputLength && input.get(position) !== SEMICOLON) {
            position++;
            if (inputLength <= position) {
                break;
            }
            let parameterValue = null;
            if (input.get(position) === QUOTATION_MARK) {
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
            if (
                parameterName.isNotEmpty &&
                everyCodePointIn(parameterName, isHTTPToken) &&
                everyCodePointIn(parameterValue, isHTTPQuotedStringToken) &&
                !parameters.has(`${parameterName}`)
            ) {
                parameters.set(`${parameterName}`, parameterValue);
            }
        }
    }
    return new MediaType(mediaTypeSource);
};
