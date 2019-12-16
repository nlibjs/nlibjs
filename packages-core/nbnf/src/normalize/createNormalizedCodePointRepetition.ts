import {SetZ} from '@nlib/real-number';
import {INBNFNormalizedCodePointRepetition, NBNFNormalizedElementType} from '../types/normalized';

export const createCodePointRepetition = (
    min: number,
    max: number,
    data: SetZ,
): INBNFNormalizedCodePointRepetition => ({
    repeat: [min, max],
    element: {
        type: NBNFNormalizedElementType.CodePoint,
        data,
    },
});
