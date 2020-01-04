import {CustomError} from '@nlib/util';
import {String} from '@nlib/global';
import {PositionCallback} from '@nlib/infra';
import {skipCWSP} from '../skip/CWSP';
import {parseAlternation} from './Alternation';
import {INBNFAlternation} from '../types/base';

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
        throw new CustomError({
            code: 'nbnf/parseAlternationWrapper/1',
            message: `Parsing error: "${String.fromCodePoint(left)}" expected`,
            data: {input, from, left, right},
        });
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
        throw new CustomError({
            code: 'nbnf/parseAlternationWrapper/2',
            message: `Parsing error: "${String.fromCodePoint(right)}" expected but input end`,
            data: {input, from, left, right},
        });
    }
    {
        const codePoint = input[position];
        if (codePoint === right) {
            position++;
        } else {
            throw new CustomError({
                code: 'nbnf/parseAlternationWrapper/3',
                message: `Parsing error: "${String.fromCodePoint(right)}" expected but get ${String.fromCodePoint(codePoint)}`,
                data: {input, from, left, right},
            });
        }
    }
    positionCallback(position);
    return alternation;
};
