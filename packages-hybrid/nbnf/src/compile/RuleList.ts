import {Object} from '@nlib/global';
import {INBNFCompiledRuleList, INBNFCompiledAlternation, INBNFNormalizedRuleList} from '../types';
import {compileAlternation} from './Alternation';

export const compileRuleList = (
    normalizedRuleList: INBNFNormalizedRuleList,
): INBNFCompiledRuleList => {
    const compiledRuleList: INBNFCompiledRuleList = {};
    for (const name of Object.keys(normalizedRuleList)) {
        const compiledAlternation: INBNFCompiledAlternation = [];
        compiledRuleList[name] = compiledAlternation;
    }
    for (const name of Object.keys(compiledRuleList)) {
        const alternation = normalizedRuleList[name];
        if (alternation) {
            compiledRuleList[name].push(...compileAlternation(
                alternation,
                compiledRuleList,
            ));
        }
    }
    return compiledRuleList;
};
