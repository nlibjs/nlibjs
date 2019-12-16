import {IntervalZ} from '@nlib/real-number';
import {toASCIILowerCaseCodePoint} from '@nlib/infra';
import {INBNFCompiledSequenceElement} from '../types/compiled';
import {INBNFTokenizerResult} from '../types/misc';

export const getCaseInsensitiveRepeatCount = (
    max: number,
    data: Uint32Array,
    input: Uint32Array,
    from: number,
): number => {
    const {length: dataLength} = data;
    let longest = 0;
    let position = from;
    while (longest < max) {
        if (data.every((codePoint, index) => codePoint === toASCIILowerCaseCodePoint(input[position + index]))) {
            position += dataLength;
            longest++;
        } else {
            break;
        }
    }
    return longest;
};

export const getCaseSensitiveRepeatCount = (
    max: number,
    data: Uint32Array,
    input: Uint32Array,
    from: number,
): number => {
    const {length: dataLength} = data;
    let longest = 0;
    let position = from;
    while (longest < max) {
        if (data.every((codePoint, index) => codePoint === input[position + index])) {
            position += dataLength;
            longest++;
        } else {
            break;
        }
    }
    return longest;
};

export const collectSequenceTokens = function* (
    [min, max]: IntervalZ,
    {data, caseSensitive}: INBNFCompiledSequenceElement,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    const longest = (caseSensitive ? getCaseSensitiveRepeatCount : getCaseInsensitiveRepeatCount)(max, data, input, from);
    for (let count = longest; min <= count; count--) {
        if (0 < count) {
            const end = from + data.length * count;
            yield {nodes: [...input.slice(from, end)], end};
        } else {
            yield {nodes: [], end: from};
            break;
        }
    }
};
