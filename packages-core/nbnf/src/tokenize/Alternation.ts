import {tokenizeConcatenation} from './Concatenation';
import {INBNFCompiledAlternation} from '../types/compiled';
import {INBNFTokenizerResult} from '../types/misc';

export const tokenizeAlternation = function* (
    alternation: INBNFCompiledAlternation,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    for (const concatenation of alternation) {
        yield* tokenizeConcatenation(concatenation, input, from);
    }
};
