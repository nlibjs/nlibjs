import {NlibError} from '@nlib/util';
import {
    NBNFNormalizedElementType,
    NBNFCompiledElementType,
    INBNFNormalizedElement,
    INBNFCompiledElement,
    INBNFCompiledRuleList,
} from '../types';
import {compileAlternation} from './Alternation';

export const compileElement = (
    element: INBNFNormalizedElement,
    compiledRules: INBNFCompiledRuleList,
): INBNFCompiledElement => {
    switch (element.type) {
    case NBNFNormalizedElementType.CodePoint:
        return {type: NBNFCompiledElementType.CodePoint, data: element.data};
    case NBNFNormalizedElementType.Sequence:
        return {type: NBNFCompiledElementType.Sequence, data: element.data, caseSensitive: element.caseSensitive};
    case NBNFNormalizedElementType.Group:
        return {type: NBNFCompiledElementType.Group, data: compileAlternation(element.data, compiledRules)};
    case NBNFNormalizedElementType.RuleName: {
        const name = element.data;
        const compiledAlternation = compiledRules[name];
        if (compiledAlternation) {
            return {type: NBNFCompiledElementType.Rule, data: {name, elements: compiledAlternation}};
        } else {
            throw new NlibError({
                code: 'nbnf/compileElement/1',
                message: `No rule: ${name}`,
                data: element,
            });
        }
    }
    default:
        throw new NlibError({
            code: 'nbnf/compileElement/2',
            message: `Unknown type: ${element}`,
            data: element,
        });
    }
};
