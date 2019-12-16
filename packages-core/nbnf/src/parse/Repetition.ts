import {
    PositionCallback,
    LEFT_SQUARE_BRACKET,
    LEFT_PARENTHESIS,
    QUOTATION_MARK,
    PERCENT_SIGN,
    LATIN_SMALL_LETTER_I,
} from '@nlib/infra';
import {parseRepeat} from './Repeat';
import {parseGroup} from './Group';
import {parseOption} from './Option';
import {parseSequence} from './Sequence';
import {parseNumVal} from './NumVal';
import {parseRuleName} from './RuleName';
import {INBNFRepetition, INBNFElement} from '../types/base';

export const parseRepetition = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
): INBNFRepetition => {
    let position = from;
    const repeat = parseRepeat(
        input,
        position,
        (newPosition) => {
            position = newPosition;
        },
    );
    let element: INBNFElement;
    switch (input[position]) {
    case LEFT_SQUARE_BRACKET:
        element = parseOption(input, position, positionCallback);
        break;
    case LEFT_PARENTHESIS:
        element = parseGroup(input, position, positionCallback);
        break;
    case QUOTATION_MARK:
        element = parseSequence(input, position, positionCallback, true);
        break;
    case PERCENT_SIGN:
        if (input[position + 1] === LATIN_SMALL_LETTER_I) {
            element = parseSequence(input, position + 2, positionCallback, false);
        } else {
            element = parseNumVal(input, position, positionCallback);
        }
        break;
    default:
        element = parseRuleName(input, position, positionCallback);
    }
    return {repeat, element};
};
