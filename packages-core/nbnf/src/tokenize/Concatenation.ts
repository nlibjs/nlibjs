import {
    INBNFCompiledConcatenation,
    INBNFTokenizerResult,
} from '../types';
import {tokenizeRepetition} from './Repetition';

export const tokenizeConcatenation = function* (
    concatenation: INBNFCompiledConcatenation,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    if (1 < concatenation.length) {
        for (const {nodes, end} of tokenizeRepetition(concatenation[0], input, from)) {
            for (const trailing of tokenizeConcatenation(concatenation.slice(1), input, end)) {
                yield {
                    nodes: nodes.concat(trailing.nodes),
                    end: trailing.end,
                };
            }
        }
    } else {
        yield* tokenizeRepetition(concatenation[0], input, from);
    }
};
