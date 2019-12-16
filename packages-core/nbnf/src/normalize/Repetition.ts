import {normalizeElement} from './Element';
import {INBNFNormalizedRepetition, INBNFNormalizedAlternation, INBNFNullableNormalizedRuleList, NBNFNormalizedElementType} from '../types/normalized';
import {INBNFRepetition, NBNFElementType} from '../types/base';

export const filterRepetition = (
    repetition: INBNFNormalizedRepetition | INBNFRepetition,
): INBNFRepetition | INBNFNormalizedRepetition => {
    if (repetition.element.type !== NBNFElementType.Option) {
        return repetition;
    }
    return {
        repeat: repetition.repeat,
        element: {
            type: NBNFElementType.Group,
            data: [[{
                repeat: [0, 1],
                element: {
                    type: NBNFElementType.Group,
                    data: repetition.element.data,
                },
            }]],
        },
    };
};

export const getSingleRepetitionInNormalizedAlternation = (
    alternation: INBNFNormalizedAlternation,
): INBNFNormalizedRepetition | null => {
    if (alternation.length !== 1) {
        return null;
    }
    const concatenation = alternation[0];
    if (concatenation.length !== 1) {
        return null;
    }
    return concatenation[0];
};

export const normalizeRepetition = (
    repetition: INBNFNormalizedRepetition | INBNFRepetition,
    expands: INBNFNullableNormalizedRuleList,
    context?: string,
): INBNFNormalizedRepetition => {
    const filteredRepetition = filterRepetition(repetition);
    const normalizedElement = normalizeElement(filteredRepetition.element, expands, context);
    const {repeat: [min, max]} = filteredRepetition;
    switch (normalizedElement.type) {
    case NBNFNormalizedElementType.Group: {
        const singleRepetition = getSingleRepetitionInNormalizedAlternation(normalizedElement.data);
        if (singleRepetition) {
            const {repeat: [singleMin, singleMax]} = singleRepetition;
            if (singleMax <= 1) {
                return {
                    ...singleRepetition,
                    repeat: [singleMin * min, singleMax * max],
                };
            }
        }
        break;
    }
    default:
    }
    return {repeat: repetition.repeat, element: normalizedElement};
};
