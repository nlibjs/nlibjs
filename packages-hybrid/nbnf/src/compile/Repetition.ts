import {
    INBNFNormalizedRepetition,
    INBNFCompiledRepetition,
    INBNFCompiledRuleList,
} from '../types';
import {compileElement} from './Element';

export const compileRepetition = (
    {repeat, element}: INBNFNormalizedRepetition,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledRepetition => ({repeat, element: compileElement(element, compiledRules)});
