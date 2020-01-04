import {CustomError} from '@nlib/util';
import {
    PositionCallback,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
    toString,
} from '@nlib/infra';
import {INBNFSequenceElement, NBNFElementType} from '../types/base';

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
        throw new CustomError({
            code: 'nbnf/parseSequence/1',
            message: 'Parsing error: QUOTATION_MARK expected at the left end',
            data: {input, from},
        });
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
        throw new CustomError({
            code: 'nbnf/parseSequence/2',
            message: 'Parsing error: codePoints is empty',
            data: {input, from},
        });
    }
    if (!terminated) {
        throw new CustomError({
            code: 'nbnf/parseSequence/3',
            message: `Parsing error: QUOTATION_MARK expected at the right end.\n${toString(input.slice(from))}`,
            data: {input, from},
        });
    }
    positionCallback(position);
    return {
        type: NBNFElementType.Sequence,
        data: collected.slice(0, length),
        caseSensitive,
    };
};
