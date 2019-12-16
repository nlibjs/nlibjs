import {compileElement} from './Element';
import {INBNFNormalizedRepetition} from '../types/normalized';
import {INBNFCompiledRuleList, INBNFCompiledRepetition} from '../types/compiled';

export const compileRepetition = (
    {repeat, element}: INBNFNormalizedRepetition,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledRepetition => ({repeat, element: compileElement(element, compiledRules)});
