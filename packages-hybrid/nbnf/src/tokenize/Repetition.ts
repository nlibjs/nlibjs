import {
    INBNFCompiledRepetition,
    NBNFCompiledElementType,
    INBNFElement,
    INBNFTokenizerResult,
} from '../types';
import {collectGroupTokens} from './GroupTokens';
import {collectRuleTokens} from './RuleTokens';
import {collectCodePointTokens} from './CodePointTokens';
import {collectSequenceTokens} from './SequenceTokens';

export const tokenizeRepetition = function* (
    {repeat, element}: INBNFCompiledRepetition,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    if (from < input.length) {
        switch (element.type) {
        case NBNFCompiledElementType.Group:
            yield* collectGroupTokens(repeat, element, input, from);
            break;
        case NBNFCompiledElementType.Rule:
            yield* collectRuleTokens(repeat, element, input, from);
            break;
        case NBNFCompiledElementType.CodePoint:
            yield* collectCodePointTokens(repeat, element, input, from);
            break;
        case NBNFCompiledElementType.Sequence:
            yield* collectSequenceTokens(repeat, element, input, from);
            break;
        default:
            throw new Error(`Invalid type: ${(element as INBNFElement).type}`);
        }
    } else if (repeat[0] === 0) {
        yield {nodes: [], end: from};
    }
};
