import {hasIntervalZ} from '../IntervalZ';
import {SetZ} from './types';

export const hasSetZ = (set: SetZ, value: number): boolean => set.some((interval) => hasIntervalZ(interval, value));
