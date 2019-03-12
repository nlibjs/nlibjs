import {
    INBNFCompiledAlternation,
    INBNFCompiledRuleList,
    INBNFNormalizedAlternation,
} from '../types';
import {compileConcatenation} from './Concatenation';
export const compileAlternation = (
    alternation: INBNFNormalizedAlternation,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledAlternation => alternation.map((concatenation) => compileConcatenation(concatenation, compiledRules));
