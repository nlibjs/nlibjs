import {stringifyIntervalR} from '../IntervalR';
import {SetR} from './types';

export const stringifySetR = (set: SetR): string => `{${set.map(stringifyIntervalR).join(' ')}}`;
