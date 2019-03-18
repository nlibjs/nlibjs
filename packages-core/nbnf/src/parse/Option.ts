import {
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    PositionCallback,
} from '@nlib/infra';
import {NBNFElementType, INBNFOptionElement} from '../types';
import {parseAlternationWrapper} from './AlternationWrapper';

export const parseOption = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFOptionElement => ({
    type: NBNFElementType.Option,
    data: parseAlternationWrapper(
        LEFT_SQUARE_BRACKET,
        RIGHT_SQUARE_BRACKET,
        input,
        from,
        positionCallback,
    ),
});
