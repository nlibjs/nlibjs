import {INBNFNormalizedAlternation} from '../types';
import {isSameNormalizedConcatenation} from './Concatenation';

export const isSameNormalizedAlternation = (
    alternation1: INBNFNormalizedAlternation,
    alternation2: INBNFNormalizedAlternation,
): boolean => {
    const {length} = alternation1;
    if (length !== alternation2.length) {
        return false;
    }
    for (let index = 0; index < length; index++) {
        if (!isSameNormalizedConcatenation(alternation1[index], alternation2[index])) {
            return false;
        }
    }
    return true;
};
