import {
    PositionCallback,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
} from '@nlib/infra';
import {parseAlternationWrapper} from './AlternationWrapper';
import {NBNFElementType, INBNFGroupElement} from '../types/base';

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
        positionCallback,
    ),
});
