import {hasIntervalR} from '../IntervalR';
import {SetR} from './types';

export const hasSetR = (set: SetR, value: number): boolean => set.some((interval) => hasIntervalR(interval, value));
