import {Object} from '@nlib/global';
import {normalizeAlternation} from './Alternation';
import {INBNFNormalizedAlternation, INBNFNullableNormalizedRuleList, INBNFNormalizedRuleList} from '../types/normalized';
import {INBNFAlternation} from '../types/base';

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
