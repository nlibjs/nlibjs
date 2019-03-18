import {
    PositionCallback,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
} from '@nlib/infra';
import {NBNFElementType, INBNFGroupElement} from '../types';
import {parseAlternationWrapper} from './AlternationWrapper';

export const parseGroup = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFGroupElement => ({
    type: NBNFElementType.Group,
    data: parseAlternationWrapper(
        LEFT_PARENTHESIS,
        RIGHT_PARENTHESIS,
        input,
        from,
        positionCallback
    ),
});
