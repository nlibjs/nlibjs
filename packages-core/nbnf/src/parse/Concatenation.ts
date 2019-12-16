import {PositionCallback} from '@nlib/infra';
import {skipCWSP} from '../skip/CWSP';
import {parseRepetition} from './Repetition';
import {INBNFConcatenation} from '../types/base';

export const parseConcatenation = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFConcatenation => {
    const {length: inputLength} = input;
    let position = from;
    const repetitions: INBNFConcatenation = [
        parseRepetition(
            input,
            position,
            (newPosition) => {
                position = newPosition;
            },
        ),
    ];
    while (position < inputLength) {
        const nextPosition = skipCWSP(input, position);
        if (position === nextPosition) {
            break;
        }
        try {
            repetitions.push(
                parseRepetition(
                    input,
                    nextPosition,
                    (newPosition) => {
                        position = newPosition;
                    },
                ),
            );
        } catch (error) {
            break;
        }
    }
    positionCallback(position);
    return repetitions;
};
