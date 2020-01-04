import {CustomError} from '@nlib/util';
import {toScalarValueString} from '@nlib/infra';
import {
    normalizeNBNF,
    normalizeNBNFFromScalarValueString,
    normalizeNBNFFromRuleList,
} from './normalizeNBNF';
import {defaultPositionCallback} from './util';
import {INBNFCompiledRuleList} from './types/compiled';
import {INBNFTokenizer, INBNFTokenizerOptions} from './types/misc';
import {tokenizeRule} from './tokenize/Rule';
import {INBNFNormalizedRuleList} from './types/normalized';
import {compileRuleList} from './compile/RuleList';
import {INBNFRuleList} from './types/base';

export const createTokenizerFromCompiledRuleList = (
    compiledRuleList: INBNFCompiledRuleList,
): INBNFTokenizer => (
    source,
    name,
    from = 0,
    positionCallback = defaultPositionCallback,
) => {
    const elements = compiledRuleList[name];
    if (!elements) {
        throw new CustomError({
            code: 'nbnf/createTokenizer/1',
            message: `No rule found: ${name}`,
            data: {source, name},
        });
    }
    for (const {node, end} of tokenizeRule({name, elements}, toScalarValueString(source), from)) {
        positionCallback(end);
        return node;
    }
    throw new CustomError({
        code: 'nbnf/createTokenizer/2',
        message: `Failed to tokenize ${name}`,
        data: {source, name},
    });
};

export const createTokenizerFromNormalizedRuleList = (
    input: INBNFNormalizedRuleList,
): INBNFTokenizer => createTokenizerFromCompiledRuleList(compileRuleList(input));

export const createTokenizerFromRuleList = (
    input: INBNFRuleList,
    options: INBNFTokenizerOptions,
): INBNFTokenizer => createTokenizerFromNormalizedRuleList(normalizeNBNFFromRuleList(input, options));

export const createTokenizerFromScalarValueString = (
    input: Uint32Array,
    options: INBNFTokenizerOptions,
): INBNFTokenizer => createTokenizerFromNormalizedRuleList(normalizeNBNFFromScalarValueString(input, options));

export const createTokenizerFromString = (
    input: string,
    options: INBNFTokenizerOptions,
): INBNFTokenizer => createTokenizerFromNormalizedRuleList(normalizeNBNF(input, options));
