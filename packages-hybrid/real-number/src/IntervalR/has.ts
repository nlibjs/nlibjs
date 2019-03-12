import {Number, Infinity} from '@nlib/global';
import {IntervalR} from './types';

export const hasIntervalR = (
    [leftIsInclusive, left, right, rightIsInclusive]: IntervalR,
    value: number,
): boolean => !(
    value < left
    || (Number.isFinite(left) && left < Infinity && value === left && !leftIsInclusive)
    || right < value
    || (Number.isFinite(right) && -Infinity < right && right === value && !rightIsInclusive)
);
