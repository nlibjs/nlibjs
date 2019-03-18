import {fromString} from '@nlib/infra';
import {
    INBNFRuleList,
    INBNFCompilerOptions,
    INBNFNormalizedRuleList,
} from './types';
import {parseRuleList} from './parse';
import {normalizeRuleList} from './normalize';

export const normalizeNBNFFromRuleList = (
    input: INBNFRuleList | INBNFNormalizedRuleList,
    options: INBNFCompilerOptions,
): INBNFNormalizedRuleList => normalizeRuleList(
    {...options.includes, ...input},
    options.expands || {},
);

export const normalizeNBNFFromScalarValueString = (
    input: Uint32Array,
    options: INBNFCompilerOptions,
): INBNFNormalizedRuleList => normalizeNBNFFromRuleList(
    parseRuleList(
        input,
        options.from || 0,
        options.positionCallback || (() => {}),
    ),
    options,
);

export const normalizeNBNF = (
    input: string,
    options: INBNFCompilerOptions = {},
): INBNFNormalizedRuleList => normalizeNBNFFromScalarValueString(
    fromString(input),
    options,
);
