import {Number} from '@nlib/global';
import {IntervalZ} from './types';

export const hasIntervalZ = (interval: IntervalZ, value: number): boolean => Number.isInteger(value) && interval[0] <= value && value <= interval[1];
