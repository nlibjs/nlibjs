import {NlibError} from '@nlib/util';
import {Object} from '@nlib/global';
import {compileAlternation} from './Alternation';
import {INBNFNormalizedRuleList} from '../types/normalized';
import {INBNFCompiledRuleList, INBNFCompiledAlternation} from '../types/compiled';

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
            const list = compiledRuleList[name];
            if (list) {
                list.push(...compileAlternation(
                    alternation,
                    compiledRuleList,
                ));
            } else {
                throw new NlibError({
                    code: 'nbnf/RuleList/1',
                    message: `No rule: ${name}`,
                    data: compiledRuleList,
                });
            }
        }
    }
    return compiledRuleList;
};
