import {
    fromString,
    ScalarValueString,
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
    slice,
    concatenate,
} from '@nlib/infra';
import {Error, RegExp} from '@nlib/global';
export type Matcher = (testee: string) => boolean;
export type Pattern = string | IRegexpLike;
export interface IRegexpLike {
    test(testee: string): boolean,
}

export const parsePattern = (pattern: Pattern): IRegexpLike => {
    if (typeof pattern !== 'string') {
        return pattern;
    }
    const source = fromString(pattern);
    const regexpSource: Array<ScalarValueString | Uint32Array> = [];
    const {length} = source;
    const buffer = source.array.slice();
    let bufferSize = 0;
    let position = 0;
    while (position < length) {
        const codePoint = source.get(position);
        if (isASCIINewline(codePoint)) {
            throw new Error('Newline characters are not allowed in patterns');
        }
        switch (codePoint) {
        case FULL_STOP:
            regexpSource.push(fromCodePoint(REVERSE_SOLIDUS, codePoint));
            bufferSize = 0;
            break;
        case REVERSE_SOLIDUS:
            regexpSource.push(fromCodePoint(codePoint, source.get(++position)));
            bufferSize = 0;
            break;
        case ASTERISK:
            regexpSource.push(new ScalarValueString(buffer.slice(0, bufferSize)));
            if (source.get(position + 1) === ASTERISK) {
                if (source.get(position + 2) !== SOLIDUS) {
                    throw new Error(`Invalid glob star: ${slice(source, position - 1, position + 1)}`);
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
    return new RegExp(`${concatenate(...regexpSource)}`);
};

export const createMatcher = (pattern: Pattern): Matcher => {
    const regexp = parsePattern(pattern);
    return (testee) => regexp.test(testee);
};
