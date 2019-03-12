import {
    PositionCallback,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
    toString,
} from '@nlib/infra';
import {
    NBNFElementType,
    INBNFSequenceElement,
} from '../types';

export const parseSequence = (
    input: Uint32Array,
    from: number,
    positionCallback: PositionCallback,
    caseSensitive: boolean,
): INBNFSequenceElement => {
    let position = from;
    if (input[position] === QUOTATION_MARK) {
        position++;
    } else {
        throw new Error('Parsing error: QUOTATION_MARK expected at the left end');
    }
    const collected = input.slice();
    const {length: inputLength} = input;
    let length = 0;
    let terminated = false;
    while (position < inputLength && !terminated) {
        const codePoint = input[position++];
        switch (codePoint) {
        case REVERSE_SOLIDUS:
            collected[length++] = input[position++];
            break;
        case QUOTATION_MARK:
            terminated = true;
            break;
        default:
            collected[length++] = codePoint;
        }
    }
    if (length === 0) {
        throw new Error('Parsing error: codePoints is empty');
    }
    if (!terminated) {
        throw new Error(`Parsing error: QUOTATION_MARK expected at the right end.\n${toString(input.slice(from))}`);
    }
    positionCallback(position);
    return {
        type: NBNFElementType.Sequence,
        data: collected.slice(0, length),
        caseSensitive,
    };
};
