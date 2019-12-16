import {Object} from '@nlib/global';
import {isSameNormalizedAlternation} from './Alternation';
import {INBNFNormalizedRuleList} from '../types/normalized';

export const isSameNormalizedRuleList = (
    ruleList1: INBNFNormalizedRuleList,
    ruleList2: INBNFNormalizedRuleList,
): boolean => {
    if (ruleList1.size !== ruleList2.size) {
        return false;
    }
    for (const key of Object.keys(ruleList1)) {
        const rule1 = ruleList1[key];
        const rule2 = ruleList2[key];
        if (!rule1 || !rule2 || !isSameNormalizedAlternation(rule1, rule2)) {
            return false;
        }
    }
    return true;
};
