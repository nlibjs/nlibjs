import {
    getNextLineHead,
    isASCIINewline,
} from '@nlib/infra';
import {skipComment} from './Comment';

/** skip comment or newline */
export const skipCNL = (
    input: Uint32Array,
    from: number,
): number => {
    const commentEnd = skipComment(input, from);
    if (from < commentEnd) {
        return skipCNL(input, commentEnd);
    } else if (isASCIINewline(input[from])) {
        return getNextLineHead(input, from);
    } else {
        return from;
    }
};
