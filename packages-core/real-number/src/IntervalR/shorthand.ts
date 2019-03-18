import {IntervalR} from './types';
export const inin = (left: number, right: number): IntervalR => [true, left, right, true];
export const inex = (left: number, right: number): IntervalR => [true, left, right, false];
export const exin = (left: number, right: number): IntervalR => [false, left, right, true];
export const exex = (left: number, right: number): IntervalR => [false, left, right, false];
