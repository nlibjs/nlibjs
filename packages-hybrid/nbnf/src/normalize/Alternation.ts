import {
    unionSetZ,
    SetZ,
    fromValuesSetZ,
} from '@nlib/real-number';
import {
    INBNFAlternation,
    INBNFNormalizedAlternation,
    INBNFNormalizedConcatenation,
    NBNFNormalizedElementType,
    INBNFNullableNormalizedRuleList,
    INBNFNormalizedElement,
} from '../types';
import {normalizeConcatenation} from './Concatenation';
import {isSameNormalizedConcatenation} from '../isSameNormalized/Concatenation';
import {isSameNormalizedElement} from '../isSameNormalized/Element';
import {
    toASCIILowerCaseCodePoint,
    toASCIIUpperCaseCodePoint,
} from '@nlib/infra';

export const getSetFromElement = (element: INBNFNormalizedElement): null | SetZ => {
    switch (element.type) {
    case NBNFNormalizedElementType.CodePoint:
        return element.data;
    case NBNFNormalizedElementType.Sequence:
        if (element.data.length === 1) {
            const codePoint = element.data[0];
            if (element.caseSensitive) {
                return fromValuesSetZ(codePoint);
            } else {
                return fromValuesSetZ(
                    toASCIILowerCaseCodePoint(codePoint),
                    toASCIIUpperCaseCodePoint(codePoint),
                );
            }
        } else {
            return null;
        }
    default:
        return null;
    }
};

export const appendConcatenation = (
    alternation: INBNFNormalizedAlternation,
    normalizedConcatenation: INBNFNormalizedConcatenation,
): void => {
    if (normalizedConcatenation.length === 1) {
        const singleRepetition = normalizedConcatenation[0];
        const {repeat, element} = singleRepetition;
        if (repeat[1] === 1) {
            const {length} = alternation;
            for (let index = 0; index < length; index++) {
                const existingConcatenation = alternation[index];
                if (existingConcatenation.length === 1) {
                    const existingSingleRepetition = existingConcatenation[0];
                    const {repeat: repeat2, element: element2} = existingSingleRepetition;
                    if (
                        element.type === element2.type
                        && repeat2[1] === repeat[1]
                        && isSameNormalizedElement(element, element2)
                    ) {
                        existingSingleRepetition.repeat = [repeat[0] * repeat2[0], 1];
                        return;
                    }
                    const set1 = getSetFromElement(element);
                    const set2 = getSetFromElement(element2);
                    if (set1 && set2) {
                        const union = unionSetZ(set1, set2);
                        alternation.splice(index, 1);
                        appendConcatenation(alternation, [
                            {
                                repeat: repeat2,
                                element: {
                                    type: NBNFNormalizedElementType.CodePoint,
                                    data: union,
                                },
                            },
                        ]);
                        return;
                    }
                }
            }
        }
    }
    if (alternation.every((collectedConcatenation) => !isSameNormalizedConcatenation(collectedConcatenation, normalizedConcatenation))) {
        alternation.push(normalizedConcatenation);
    }
};

export const normalizeAlternation = (
    rule: INBNFNormalizedAlternation | INBNFAlternation,
    expands: INBNFNullableNormalizedRuleList,
    context?: string,
): INBNFNormalizedAlternation => {
    const result: INBNFNormalizedAlternation = [];
    for (const concatenation of rule) {
        const normalizedConcatenation = normalizeConcatenation(concatenation, expands, context);
        if (normalizedConcatenation.length === 1) {
            const {repeat: [min, max], element} = normalizedConcatenation[0];
            if (element.type === NBNFNormalizedElementType.Group && min === 1 && max === 1) {
                for (const concatenation of element.data) {
                    appendConcatenation(result, concatenation);
                }
            } else {
                appendConcatenation(result, normalizedConcatenation);
            }
        } else {
            appendConcatenation(result, normalizedConcatenation);
        }
    }
    return result;
};
