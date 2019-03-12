import {Error, String} from '@nlib/global';
import {
    PositionCallback,
    REVERSE_SOLIDUS,
    isScalarValue,
    toString,
} from '@nlib/infra';
import {
    isNotRuleNameCharacter,
    isNotRuleNameFirstCharacter,
} from '../codePoints';
import {
    NBNFElementType,
    INBNFRuleNameElement,
} from '../types';

export const parseRuleName = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFRuleNameElement => {
    const collected = input.slice();
    const {length: inputLength} = input;
    let position = from;
    let length = 0;
    {
        const firstCodePoint = input[position];
        if (isNotRuleNameFirstCharacter(firstCodePoint)) {
            throw new Error(`Parsing error: invalid first codePoint 0x${firstCodePoint.toString(16)} (${String.fromCodePoint(firstCodePoint)}) at ${position}\n${toString(input.slice(position))}`);
        } else if (isScalarValue(firstCodePoint)) {
            position++;
            collected[length++] = firstCodePoint;
        } else {
            throw new Error(`Parsing error: no codePoints at ${from}`);
        }
    }
    while (position < inputLength) {
        const codePoint = input[position];
        if (isNotRuleNameCharacter(codePoint)) {
            break;
        } else if (codePoint === REVERSE_SOLIDUS) {
            collected[length++] = input[position + 1];
            position += 2;
        } else {
            collected[length++] = input[position++];
        }
    }
    positionCallback(position);
    return {
        type: NBNFElementType.RuleName,
        data: toString(collected.slice(0, length)),
    };
};