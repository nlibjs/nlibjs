import {
    INBNFCompiledAlternation,
    INBNFTokenizerResult,
} from '../types';
import {tokenizeConcatenation} from './Concatenation';

export const tokenizeAlternation = function* (
    alternation: INBNFCompiledAlternation,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    for (const concatenation of alternation) {
        yield* tokenizeConcatenation(concatenation, input, from);
    }
};
