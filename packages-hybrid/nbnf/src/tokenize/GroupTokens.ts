import {IntervalZ} from '@nlib/real-number';
import {
    INBNFASTNodeList,
    INBNFCompiledGroupElement,
    INBNFTokenizerResult,
} from '../types';
import {tokenizeAlternation} from './Alternation';

export const collectGroupTokens = function* (
    [min, max]: IntervalZ,
    element: INBNFCompiledGroupElement,
    input: Uint32Array,
    from: number,
    leadings: INBNFASTNodeList = [],
): IterableIterator<INBNFTokenizerResult> {
    if (1 < max) {
        for (const {nodes, end} of tokenizeAlternation(element.data, input, from)) {
            yield* collectGroupTokens([min, max - 1], element, input, end, [...leadings, ...nodes]);
        }
    } else if (min - 1 <= leadings.length) {
        for (const {nodes, end} of tokenizeAlternation(element.data, input, from)) {
            yield {nodes: [...leadings, ...nodes], end};
        }
    }
    if (min <= leadings.length) {
        yield {nodes: leadings, end: from};
    }
};
