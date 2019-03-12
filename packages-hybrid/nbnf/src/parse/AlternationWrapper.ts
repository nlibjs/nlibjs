import {Error, String} from '@nlib/global';
import {PositionCallback} from '@nlib/infra';
import {skipCWSP} from '../skip/CWSP';
import {parseAlternation} from './Alternation';
import {INBNFAlternation} from '../types';

export const parseAlternationWrapper = (
    left: number,
    right: number,
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFAlternation => {
    let position = from;
    if (input[position] === left) {
        position++;
    } else {
        throw new Error(`Parsing error: "${String.fromCodePoint(left)}" expected`);
    }
    position = skipCWSP(input, position);
    const alternation = parseAlternation(
        input,
        position,
        (newPosition) => {
            position = newPosition;
        },
    );
    position = skipCWSP(input, position);
    if (input.length <= position) {
        throw new Error(`Parsing error: "${String.fromCodePoint(right)}" expected but input end`);
    }
    {
        const codePoint = input[position];
        if (codePoint === right) {
            position++;
        } else {
            throw new Error(`Parsing error: "${String.fromCodePoint(right)}" expected but get ${String.fromCodePoint(codePoint)}`);
        }
    }
    positionCallback(position);
    return alternation;
};
