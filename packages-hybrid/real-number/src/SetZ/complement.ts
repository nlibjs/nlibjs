import {Infinity} from '@nlib/global';
import {SetZ} from './types';
import {normalizeSetZ} from './normalize';

export const complementSetZ = (set: SetZ): SetZ => {
    const result: SetZ = [];
    let pos = -Infinity;
    for (const [left, right] of normalizeSetZ(set)) {
        if (pos < left) {
            result.push([pos, left - 1]);
        }
        pos = right + 1;
    }
    if (pos < Infinity) {
        result.push([pos, Infinity]);
    }
    return result;
};
