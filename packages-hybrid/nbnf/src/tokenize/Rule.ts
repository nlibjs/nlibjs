import {
    INBNFCompiledRuleElementData,
    INBNFASTRuleNode,
} from '../types';
import {tokenizeAlternation} from './Alternation';

export const tokenizeRule = function* (
    {name, elements}: INBNFCompiledRuleElementData,
    input: Uint32Array,
    from: number,
): IterableIterator<{node: INBNFASTRuleNode, end: number}> {
    for (const {nodes, end} of tokenizeAlternation(elements, input, from)) {
        yield {node: {name, nodes}, end};
    }
};
