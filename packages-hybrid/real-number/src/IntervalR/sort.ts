import {IntervalR} from './types';

export const sortIntervalR = (
    intervalR1: IntervalR,
    intervalR2: IntervalR,
): -1 | 0 | 1 => {
    if (intervalR1[1] < intervalR2[1]) {
        return -1;
    }
    if (intervalR2[1] < intervalR1[1]) {
        return 1;
    }
    if (intervalR1[0] && !intervalR2[0]) {
        return -1;
    }
    if (!intervalR1[0] && intervalR2[0]) {
        return 1;
    }
    if (intervalR1[2] < intervalR2[2]) {
        return -1;
    }
    if (intervalR2[2] < intervalR1[2]) {
        return 1;
    }
    if (intervalR1[3] && !intervalR2[3]) {
        return 1;
    }
    if (!intervalR1[3] && intervalR2[3]) {
        return -1;
    }
    return 0;
};

export const sortIntervalR2 = (
    intervalR1: IntervalR,
    intervalR2: IntervalR,
): [IntervalR, IntervalR] => sortIntervalR(intervalR1, intervalR2) <= 0 ? [intervalR1, intervalR2] : [intervalR2, intervalR1];
