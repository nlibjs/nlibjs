import {CustomError} from '@nlib/util';
import {
    fromCodePoint,
    toASCIILowerCaseCodePoint,
    toASCIILowerCase,
} from '@nlib/infra';
import {normalizeAlternation} from './Alternation';
import {intersectionSetZ} from '@nlib/real-number';
import {INBNFElement, NBNFElementType} from '../types/base';
import {INBNFNormalizedElement, INBNFNullableNormalizedRuleList, NBNFNormalizedElementType} from '../types/normalized';

export const normalizeElement = (
    element: INBNFElement | INBNFNormalizedElement,
    expands: INBNFNullableNormalizedRuleList,
    context?: string,
): INBNFNormalizedElement => {
    switch (element.type) {
    case NBNFNormalizedElementType.RuleName:
    case NBNFElementType.RuleName: {
        const {data} = element;
        const expanded = context !== data && expands[data];
        if (expanded) {
            return {type: NBNFNormalizedElementType.Group, data: normalizeAlternation(expanded, expands, context)};
        } else {
            return {type: NBNFNormalizedElementType.RuleName, data};
        }
    }
    case NBNFNormalizedElementType.Group:
    case NBNFElementType.Group:
        return {type: NBNFNormalizedElementType.Group, data: normalizeAlternation(element.data, expands, context)};
    case NBNFNormalizedElementType.Sequence:
    case NBNFElementType.Sequence:
        return {
            type: NBNFNormalizedElementType.Sequence,
            data: element.caseSensitive ? element.data : toASCIILowerCase(element.data),
            caseSensitive: element.caseSensitive,
        };
    case NBNFNormalizedElementType.CodePoint:
    case NBNFElementType.CodePoint: {
        const set = intersectionSetZ(element.data, [[0, 0x10ffff]]);
        if (set.length === 1) {
            const [from, to] = set[0];
            if (from === to) {
                return {type: NBNFNormalizedElementType.Sequence, data: fromCodePoint(from), caseSensitive: true};
            } else {
                const lowerFrom = toASCIILowerCaseCodePoint(from);
                if (lowerFrom === toASCIILowerCaseCodePoint(to)) {
                    return {type: NBNFNormalizedElementType.Sequence, data: fromCodePoint(lowerFrom), caseSensitive: false};
                }
            }
        }
        return {type: NBNFNormalizedElementType.CodePoint, data: element.data};
    }
    default:
        throw new CustomError({
            code: 'nbnf/normalizeElement/1',
            message: `Unknown type: ${element.type}`,
            data: {element, expands, context},
        });
    }
};
