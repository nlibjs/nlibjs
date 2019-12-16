import {compileConcatenation} from './Concatenation';
import {INBNFNormalizedAlternation} from '../types/normalized';
import {INBNFCompiledRuleList, INBNFCompiledAlternation} from '../types/compiled';
export const compileAlternation = (
    alternation: INBNFNormalizedAlternation,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledAlternation => alternation.map((concatenation) => compileConcatenation(concatenation, compiledRules));
