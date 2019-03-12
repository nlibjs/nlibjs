import {isSameIntervalZ} from '@nlib/real-number';
import {INBNFNormalizedRepetition} from '../types';
import {isSameNormalizedElement} from './Element';

export const isSameNormalizedRepetition = (
    repetition1: INBNFNormalizedRepetition,
    repetition2: INBNFNormalizedRepetition,
): boolean => isSameIntervalZ(repetition1.repeat, repetition2.repeat) && isSameNormalizedElement(repetition1.element, repetition2.element);
