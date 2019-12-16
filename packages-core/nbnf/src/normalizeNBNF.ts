import {fromString} from '@nlib/infra';
import {defaultPositionCallback} from './util';
import {INBNFRuleList} from './types/base';
import {INBNFNormalizedRuleList} from './types/normalized';
import {INBNFCompilerOptions} from './types/misc';
import {normalizeRuleList} from './normalize/RuleList';
import {parseRuleList} from './parse/RuleList';

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
        options.positionCallback || defaultPositionCallback,
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
