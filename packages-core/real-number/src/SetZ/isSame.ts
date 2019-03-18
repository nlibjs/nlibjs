import {SetZ} from './types';
import {normalizeSetZ} from './normalize';
import {isSameIntervalZ} from '../IntervalZ';

export const isSameSetZ = (
    interval1: SetZ,
    interval2: SetZ,
): boolean => {
    const normalized1 = normalizeSetZ(interval1);
    const normalized2 = normalizeSetZ(interval2);
    const {length} = normalized1;
    if (length !== normalized2.length) {
        return false;
    }
    for (let index = 0; index < length; index++) {
        if (!isSameIntervalZ(normalized1[index], normalized2[index])) {
            return false;
        }
    }
    return true;
};
