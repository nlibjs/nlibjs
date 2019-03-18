import {Infinity} from '@nlib/global';
import {SetR} from './types';
import {normalizeSetR} from './normalize';

export const complementSetR = (set: SetR): SetR => {
    const result: SetR = [];
    let pos = -Infinity;
    let inclusive = false;
    for (const [leftFlag, left, right, rightFlag] of normalizeSetR(set)) {
        if (pos <= left && inclusive !== leftFlag) {
            result.push([inclusive, pos, left, !leftFlag]);
        }
        pos = right;
        inclusive = !rightFlag;
    }
    if (pos < Infinity) {
        result.push([inclusive, pos, Infinity, false]);
    }
    return result;
};
