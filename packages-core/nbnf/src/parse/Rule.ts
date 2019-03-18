import {NlibError} from '@nlib/util';
import {
    PositionCallback,
    EQUALS_SIGN,
    SOLIDUS,
    getNextLineHead,
} from '@nlib/infra';
import {parseRuleName} from './RuleName';
import {skipCWSP} from '../skip/CWSP';
import {INBNFRule} from '../types';
import {parseElements} from './Elements';

export const parseRule = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFRule => {
    let position = from;
    const {data: name} = parseRuleName(
        input,
        position,
        (newPosition) => {
            position = newPosition;
        },
    );
    position = skipCWSP(input, position);
    let incremental = false;
    if (input[position] === EQUALS_SIGN) {
        position += 1;
        if (input[position] === SOLIDUS) {
            incremental = true;
            position += 1;
        }
    } else {
        throw new NlibError({
            code: 'nbnf/parseRule/1',
            message: `Parsing error at ${position}: "=" expected.`,
            data: {input, from},
        });
    }
    position = skipCWSP(input, position);
    const elements = parseElements(
        input,
        position,
        (newPosition) => {
            position = newPosition;
        },
    );
    position = getNextLineHead(input, position);
    positionCallback(position);
    return {name, incremental, elements};
};
