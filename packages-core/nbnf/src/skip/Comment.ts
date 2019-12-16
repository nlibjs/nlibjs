import {Uint32Array} from '@nlib/global';
import {SEMICOLON, getNextLineHead} from '@nlib/infra';

export const COMMENTSTARTER = Uint32Array.of(SEMICOLON);

export const skipComment = (
    input: Uint32Array,
    from: number,
): number => {
    if (COMMENTSTARTER.every((codePoint, index) => codePoint === input[from + index])) {
        return getNextLineHead(input, from);
    }
    return from;
};
