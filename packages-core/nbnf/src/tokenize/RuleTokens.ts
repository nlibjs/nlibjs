import {IntervalZ} from '@nlib/real-number';
import {tokenizeRule} from './Rule';
import {INBNFCompiledRuleElement} from '../types/compiled';
import {INBNFASTNodeList, INBNFTokenizerResult} from '../types/misc';

export const collectRuleTokens = function* (
    [min, max]: IntervalZ,
    element: INBNFCompiledRuleElement,
    input: Uint32Array,
    from: number,
    leadings: INBNFASTNodeList = [],
): IterableIterator<INBNFTokenizerResult> {
    if (1 < max) {
        for (const {node, end} of tokenizeRule(element.data, input, from)) {
            yield* collectRuleTokens([min, max - 1], element, input, end, [...leadings, node]);
        }
    } else if (min - 1 <= leadings.length) {
        for (const {node, end} of tokenizeRule(element.data, input, from)) {
            yield {nodes: [...leadings, node], end};
        }
    }
    if (min <= leadings.length) {
        yield {nodes: leadings, end: from};
    }
};
