import {skip} from './4.6.Strings';
import {isASCIINewline, CARRIAGE_RETURN, LINE_FEED} from './4.5.CodePoints';

export const getNextLineHead = (input: Uint32Array, from: number): number => {
    const currentLineEnd = skip(input, from, (codePoint) => !isASCIINewline(codePoint));
    return currentLineEnd + (input[currentLineEnd] === CARRIAGE_RETURN && input[currentLineEnd + 1] === LINE_FEED ? 2 : 1);
};
