import {SOLIDUS, PositionCallback} from '@nlib/infra';
import {skipCWSP} from '../skip/CWSP';
import {INBNFAlternation} from '../types';
import {parseConcatenation} from './Concatenation';

export const parseAlternation = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFAlternation => {
    const {length: inputLength} = input;
    let position = from;
    const concatenations: INBNFAlternation = [];
    while (position < inputLength) {
        concatenations.push(
            parseConcatenation(
                input,
                position,
                (newPosition) => {
                    position = newPosition;
                },
            ),
        );
        const solidusPosition = skipCWSP(input, position);
        if (input[solidusPosition] === SOLIDUS) {
            position = skipCWSP(input, solidusPosition + 1);
        } else {
            break;
        }
    }
    positionCallback(position);
    return concatenations;
};
