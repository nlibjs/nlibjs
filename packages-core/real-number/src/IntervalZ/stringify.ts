import {stringify as stringifyNumber} from '@nlib/number';
import {IntervalZ} from './types';
export const stringifyIntervalZ = ([l, r]: IntervalZ): string => `[${stringifyNumber(l)}, ${stringifyNumber(r)}]`;
