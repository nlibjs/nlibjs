import {isSameNormalizedRepetition} from './Repetition';
import {INBNFNormalizedConcatenation} from '../types/normalized';

export const isSameNormalizedConcatenation = (
    concatenation1: INBNFNormalizedConcatenation,
    concatenation2: INBNFNormalizedConcatenation,
): boolean => {
    const {length} = concatenation1;
    if (length !== concatenation2.length) {
        return false;
    }
    for (let index = 0; index < length; index++) {
        if (!isSameNormalizedRepetition(concatenation1[index], concatenation2[index])) {
            return false;
        }
    }
    return true;
};
