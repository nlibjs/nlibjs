import {PositionCallback} from '@nlib/infra';
import {skipCWSP} from '../skip/CWSP';
import {INBNFAlternation} from '../types';
import {parseAlternation} from './Alternation';

export const parseElements = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFAlternation => {
    let position = from;
    const alternation = parseAlternation(
        input,
        from,
        (newPosition) => {
            position = newPosition;
        },
    );
    position = skipCWSP(input, position);
    positionCallback(position);
    return alternation;
};
