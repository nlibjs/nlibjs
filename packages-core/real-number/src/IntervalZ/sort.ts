import {IntervalZ} from './types';

export const sortIntervalZ = (
    intervalZ1: IntervalZ,
    intervalZ2: IntervalZ,
): -1 | 0 | 1 => {
    if (intervalZ1[0] < intervalZ2[0]) {
        return -1;
    }
    if (intervalZ2[0] < intervalZ1[0]) {
        return 1;
    }
    if (intervalZ1[1] < intervalZ2[1]) {
        return -1;
    }
    if (intervalZ2[1] < intervalZ1[1]) {
        return 1;
    }
    return 0;
};

export const sortIntervalZ2 = (
    intervalZ1: IntervalZ,
    intervalZ2: IntervalZ,
): [IntervalZ, IntervalZ] => sortIntervalZ(intervalZ1, intervalZ2) <= 0 ? [intervalZ1, intervalZ2] : [intervalZ2, intervalZ1];
