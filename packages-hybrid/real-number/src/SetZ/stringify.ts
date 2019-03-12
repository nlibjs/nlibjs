import {stringifyIntervalZ} from '../IntervalZ';
import {SetZ} from './types';

export const stringifySetZ = (set: SetZ): string => `{${set.map(stringifyIntervalZ).join(' ')}}`;
