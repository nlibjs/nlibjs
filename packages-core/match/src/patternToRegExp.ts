import {
    fromString,
    ASTERISK,
    FULL_STOP,
    REVERSE_SOLIDUS,
    CIRCUMFLEX_ACCENT,
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
    QUESTION_MARK,
    COLON,
    fromCodePoint,
    isASCIINewline,
    SOLIDUS,
    concatenate,
    toString,
} from '@nlib/infra';
import {RegExp} from '@nlib/global';
import {CustomError} from '@nlib/util';
import {Pattern, IRegexpLike} from './types';

export const patternToRegExp = (pattern: Pattern): IRegexpLike => {
    if (typeof pattern !== 'string') {
        return pattern;
    }
    const source = fromString(pattern);
    const regexpSource: Array<Uint32Array> = [];
    const {length} = source;
    const buffer = source.slice();
    let bufferSize = 0;
    let position = 0;
    while (position < length) {
        const codePoint = source[position];
        if (isASCIINewline(codePoint)) {
            throw new CustomError({
                code: 'EInvalidCharacter',
                message: 'Newline characters are not allowed in patterns',
                data: pattern,
            });
        }
        switch (codePoint) {
        case FULL_STOP:
            regexpSource.push(fromCodePoint(REVERSE_SOLIDUS, codePoint));
            bufferSize = 0;
            break;
        case REVERSE_SOLIDUS:
            regexpSource.push(fromCodePoint(codePoint, source[++position]));
            bufferSize = 0;
            break;
        case ASTERISK:
            regexpSource.push(buffer.slice(0, bufferSize));
            if (source[position + 1] === ASTERISK) {
                if (source[position + 2] !== SOLIDUS) {
                    throw new CustomError({
                        code: 'EInvalidGlobStart',
                        message: `Invalid glob star: ${source.slice(position - 1, position + 1)}`,
                        data: pattern,
                    });
                }
                regexpSource.push(fromCodePoint(
                    LEFT_PARENTHESIS,
                    QUESTION_MARK,
                    COLON,
                    FULL_STOP,
                    codePoint,
                    SOLIDUS,
                    RIGHT_PARENTHESIS,
                    QUESTION_MARK,
                ));
                position += 2;
            } else {
                regexpSource.push(fromCodePoint(
                    LEFT_SQUARE_BRACKET,
                    CIRCUMFLEX_ACCENT,
                    SOLIDUS,
                    RIGHT_SQUARE_BRACKET,
                    codePoint,
                ));
            }
            bufferSize = 0;
            regexpSource.push(buffer.slice(0, bufferSize));
            break;
        default:
            buffer[bufferSize++] = codePoint;
        }
        position += 1;
    }
    if (0 < bufferSize) {
        regexpSource.push(buffer.slice(0, bufferSize));
    }
    return new RegExp(toString(concatenate(...regexpSource)));
};
