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
        [name: string]: INBNFNormalizedAlternation | INBNFAlternation | undefined,
    },
    expands: INBNFNullableNormalizedRuleList = {},
): INBNFNormalizedRuleList => {
    const result: INBNFNormalizedRuleList = {};
    for (const [key, alternation] of Object.entries(ruleList)) {
        if (alternation) {
            result[key] = normalizeAlternation(alternation, expands, key);
        }
    }
    return result;
};
