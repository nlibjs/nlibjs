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
            throw new Error(`No rule: ${name}`);
        }
    }
    default:
        throw new Error(`Unknown type: ${element}`);
    }
};
