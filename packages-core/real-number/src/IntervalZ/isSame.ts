import {IntervalZ} from './types';

export const isSameIntervalZ = (
    interval1: IntervalZ,
    interval2: IntervalZ,
): boolean => interval1[0] === interval2[0] && interval1[1] === interval2[1];
