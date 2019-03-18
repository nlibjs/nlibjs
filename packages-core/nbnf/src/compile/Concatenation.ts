import {
    INBNFCompiledConcatenation,
    INBNFCompiledRuleList,
    INBNFNormalizedConcatenation,
} from '../types';
import {compileRepetition} from './Repetition';
export const compileConcatenation = (
    concatenation: INBNFNormalizedConcatenation,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledConcatenation => concatenation.map((repetition) => compileRepetition(repetition, compiledRules));
