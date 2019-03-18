import {
    NBNFNormalizedElementType,
    INBNFConcatenation,
    INBNFNormalizedConcatenation,
    INBNFNormalizedRepetition,
    INBNFNullableNormalizedRuleList,
} from '../types';
import {normalizeRepetition} from './Repetition';
import {isSameNormalizedAlternation} from '../isSameNormalized/Alternation';
import {isSameNormalizedElement} from '../isSameNormalized/Element';
import {concatenate} from '@nlib/infra';

export const getMergedSequence = (
    {repeat: [min1, max1], element: element1}: INBNFNormalizedRepetition,
    {repeat: [min2, max2], element: element2}: INBNFNormalizedRepetition,
): {data: Uint32Array, caseSensitive: boolean} | null => {
    if (
        min1 !== 1 ||
        max1 !== 1 ||
        min2 !== 1 ||
        max2 !== 1 ||
        element1.type !== NBNFNormalizedElementType.Sequence ||
        element2.type !== NBNFNormalizedElementType.Sequence ||
        element1.caseSensitive !== element2.caseSensitive) {
        return null;
    }
    return {
        data: concatenate(element1.data, element2.data),
        caseSensitive: element1.caseSensitive,
    };
};

export const normalizeConcatenation = (
    concatenation: INBNFNormalizedConcatenation | INBNFConcatenation,
    expands: INBNFNullableNormalizedRuleList,
    context?: string,
): INBNFNormalizedConcatenation => {
    const result: INBNFNormalizedConcatenation = [];
    for (const repetition of concatenation) {
        const normalizedRepetition = normalizeRepetition(repetition, expands, context);
        const {repeat: [min, max], element} = normalizedRepetition;
        if (0 < max) {
            let consumed = false;
            if (0 < result.length) {
                const lastRepetition = result[0];
                const {repeat: lastRepeat, element: lastElement} = lastRepetition;
                if (element.type === NBNFNormalizedElementType.Group && lastElement.type === NBNFNormalizedElementType.Group) {
                    if (isSameNormalizedAlternation(element.data, lastElement.data)) {
                        lastRepeat[0] += min;
                        lastRepeat[1] += max;
                        consumed = true;
                    }
                } else {
                    const mergedSequenceData = getMergedSequence(lastRepetition, normalizedRepetition);
                    if (mergedSequenceData) {
                        result[0] = {
                            repeat: lastRepeat,
                            element: {type: NBNFNormalizedElementType.Sequence, ...mergedSequenceData},
                        };
                        consumed = true;
                    } else if (isSameNormalizedElement(element, lastElement)) {
                        lastRepeat[0] += min;
                        lastRepeat[1] += max;
                        consumed = true;
                    }
                }
            }
            if (!consumed) {
                result.unshift(normalizedRepetition);
            }
        }
    }
    return result.reverse();
};
