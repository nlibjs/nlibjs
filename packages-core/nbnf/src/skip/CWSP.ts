import {skip} from '@nlib/infra';
import {skipCNL} from './CNL';
import {isWSP} from '../codePoints';

/** skip comment or newline */
export const skipCWSP = (
    input: Uint32Array,
    from: number,
): number => {
    let position = skipCNL(input, skip(input, from, isWSP));
    if (from < position) {
        position = skipCWSP(input, position);
    }
    return isWSP(input[position - 1]) ? position : from;
};
