import {Object} from '@nlib/global';
import {
    INBNFNormalizedRuleList,
    INBNFNormalizedAlternation,
    INBNFAlternation,
    INBNFNullableNormalizedRuleList,
} from '../types';
import {normalizeAlternation} from './Alternation';

export const normalizeRuleList = (
    ruleList: {
        [name: string]: INBNFNormalizedAlternation | INBNFAlternation,
    },
    expands: INBNFNullableNormalizedRuleList = {},
): INBNFNormalizedRuleList => {
    const result: INBNFNormalizedRuleList = {};
    for (const key of Object.keys(ruleList)) {
        result[key] = normalizeAlternation(ruleList[key], expands, key);
    }
    return result;
};
