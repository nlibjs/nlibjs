import {
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    PositionCallback,
} from '@nlib/infra';
import {parseAlternationWrapper} from './AlternationWrapper';
import {INBNFOptionElement, NBNFElementType} from '../types/base';

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
