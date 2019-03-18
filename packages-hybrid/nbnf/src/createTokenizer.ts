import {NlibError} from '@nlib/util';
import {toScalarValueString} from '@nlib/infra';
import {
    INBNFRuleList,
    INBNFTokenizer,
    INBNFCompiledRuleList,
    INBNFTokenizerOptions,
    INBNFNormalizedRuleList,
} from './types';
import {compileRuleList} from './compile';
import {tokenizeRule} from './tokenize';
import {
    normalizeNBNF,
    normalizeNBNFFromScalarValueString,
    normalizeNBNFFromRuleList,
} from './normalizeNBNF';

export const createTokenizerFromCompiledRuleList = (compiledRuleList: INBNFCompiledRuleList): INBNFTokenizer => (
    source,
    name,
    from = 0,
    positionCallback = () => {},
) => {
    const elements = compiledRuleList[name];
    if (!elements) {
        throw new NlibError({
            code: 'nbnf/createTokenizer/1',
            message: `No rule found: ${name}`,
            data: {source, name},
        });
    }
    for (const {node, end} of tokenizeRule({name, elements}, toScalarValueString(source), from)) {
        positionCallback(end);
        return node;
    }
    throw new NlibError({
        code: 'nbnf/createTokenizer/2',
        message: `Failed to tokenize ${name}`,
        data: {source, name},
    });
};

export const createTokenizerFromNormalizedRuleList = (input: INBNFNormalizedRuleList): INBNFTokenizer => createTokenizerFromCompiledRuleList(compileRuleList(input));

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
