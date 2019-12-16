import {isSameIntervalZ} from '@nlib/real-number';
import {isSameNormalizedElement} from './Element';
import {INBNFNormalizedRepetition} from '../types/normalized';

export const isSameNormalizedRepetition = (
    repetition1: INBNFNormalizedRepetition,
    repetition2: INBNFNormalizedRepetition,
): boolean => isSameIntervalZ(repetition1.repeat, repetition2.repeat) && isSameNormalizedElement(repetition1.element, repetition2.element);
