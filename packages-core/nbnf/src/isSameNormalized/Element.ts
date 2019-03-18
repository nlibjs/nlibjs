import {NlibError} from '@nlib/util';
import {isSameSetZ} from '@nlib/real-number';
import {equal} from '@nlib/infra';
import {
    NBNFNormalizedElementType,
    INBNFNormalizedElement,
    INBNFNormalizedGroupElementData,
    INBNFNormalizedCodePointElement,
    INBNFNormalizedGroupElement,
    INBNFNormalizedRuleNameElement,
    INBNFNormalizedSequenceElement,
} from '../types';
import {isSameNormalizedAlternation} from './Alternation';

export const isSameNormalizedAlternationElementData = (
    data1: INBNFNormalizedGroupElementData,
    data2: INBNFNormalizedGroupElementData,
): boolean => isSameNormalizedAlternation(data1, data2);

export const isSameSequenceElement = (
    element1: INBNFNormalizedSequenceElement,
    element2: INBNFNormalizedSequenceElement,
): boolean => element1.caseSensitive === element2.caseSensitive && equal(element1.data, element2.data);

export const isSameNormalizedElement = (
    element1: INBNFNormalizedElement,
    element2: INBNFNormalizedElement,
): boolean => {
    if (element1.type !== element2.type) {
        return false;
    }
    switch (element1.type) {
    case NBNFNormalizedElementType.CodePoint:
        return isSameSetZ(
            element1.data,
            (element2 as INBNFNormalizedCodePointElement).data,
        );
    case NBNFNormalizedElementType.Group:
        return isSameNormalizedAlternationElementData(
            element1.data,
            (element2 as INBNFNormalizedGroupElement).data,
        );
    case NBNFNormalizedElementType.RuleName:
        return element1.data === (element2 as INBNFNormalizedRuleNameElement).data;
    case NBNFNormalizedElementType.Sequence:
        return isSameSequenceElement(element1, element2 as INBNFNormalizedSequenceElement);
    default:
        throw new NlibError({
            code: 'nbnf/isSameNormalizedElement/1',
            message: `Unknown element type: ${element1}`,
            data: {element1, element2},
        });
    }
};
