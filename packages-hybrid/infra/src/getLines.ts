import {
    ScalarValueString,
    skip,
} from './4.6.Strings';
import {
    isASCIINonNewlineWhitespace, LINE_FEED, CARRIAGE_RETURN,
} from './4.5.CodePoints';

export const getLines = function* (input: ScalarValueString): IterableIterator<ScalarValueString> {
    const {length} = input;
    let position = 0;
    const collected = input.array;
    let collectedLength = 0;
    while (position < length) {
        const codePoint = input.get(position);
        let flush = codePoint === LINE_FEED;
        if (codePoint === CARRIAGE_RETURN) {
            if (input.get(position + 1) === LINE_FEED) {
                position++;
            }
            flush = true;
        }
        if (flush) {
            yield new ScalarValueString(collected.slice(0, collectedLength));
            collectedLength = 0;
        } else {
            collected[collectedLength++] = codePoint;
        }
        position++;
    }
    yield new ScalarValueString(collected.slice(0, collectedLength));
};

export const getTrimmedLines = function* (input: ScalarValueString): IterableIterator<ScalarValueString> {
    const {length} = input;
    let position = skip(input, 0, isASCIINonNewlineWhitespace);
    const collected = input.array;
    let collectedLength = 0;
    let whitespaceLength = 0;
    while (position < length) {
        const codePoint = input.get(position);
        let flush = codePoint === LINE_FEED;
        if (codePoint === CARRIAGE_RETURN) {
            if (input.get(position + 1) === LINE_FEED) {
                position++;
            }
            flush = true;
        }
        if (flush) {
            yield new ScalarValueString(collected.slice(0, collectedLength - whitespaceLength));
            collectedLength = 0;
            whitespaceLength = 0;
            position = skip(input, position + 1, isASCIINonNewlineWhitespace);
        } else {
            if (isASCIINonNewlineWhitespace(codePoint)) {
                whitespaceLength++;
            } else {
                whitespaceLength = 0;
            }
            collected[collectedLength++] = codePoint;
            position++;
        }
    }
    yield new ScalarValueString(collected.slice(0, collectedLength - whitespaceLength));
};
