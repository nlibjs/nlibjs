import {
    ScalarValueString,
    skipASCIINonNewlineWhitespace,
} from './4.6.Strings';
import {
    isASCIINonNewlineWhitespace,
} from './4.5.CodePoints';
import {CodePoint} from './types';
const LF = 0x000A as CodePoint;
const CR = 0x000D as CodePoint;

export const getLines = function* (input: ScalarValueString): IterableIterator<ScalarValueString> {
    const {length} = input;
    let position = 0;
    const collected = input.array;
    let collectedLength = 0;
    while (position < length) {
        const codePoint = input.get(position);
        let flush = codePoint === LF;
        if (codePoint === CR) {
            if (input.get(position + 1) === LF) {
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
    let position = skipASCIINonNewlineWhitespace(input, 0);
    const collected = input.array;
    let collectedLength = 0;
    let whitespaceLength = 0;
    while (position < length) {
        const codePoint = input.get(position);
        let flush = codePoint === LF;
        if (codePoint === CR) {
            if (input.get(position + 1) === LF) {
                position++;
            }
            flush = true;
        }
        if (flush) {
            yield new ScalarValueString(collected.slice(0, collectedLength - whitespaceLength));
            collectedLength = 0;
            whitespaceLength = 0;
            position = skipASCIINonNewlineWhitespace(input, position + 1);
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
