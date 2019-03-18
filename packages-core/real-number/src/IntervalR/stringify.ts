import {stringify as stringifyNumber} from '@nlib/number';
import {IntervalR} from './types';
export const stringifyIntervalR = ([leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag]: IntervalR): string => `${leftInclusiveFlag ? '[' : '('}${stringifyNumber(leftEnd)}, ${stringifyNumber(rightEnd)}${rightInclusiveFlag ? ']' : ')'}`;
