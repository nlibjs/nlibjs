import {compileRepetition} from './Repetition';
import {INBNFNormalizedConcatenation} from '../types/normalized';
import {INBNFCompiledRuleList, INBNFCompiledConcatenation} from '../types/compiled';
export const compileConcatenation = (
    concatenation: INBNFNormalizedConcatenation,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledConcatenation => concatenation.map((repetition) => compileRepetition(repetition, compiledRules));
