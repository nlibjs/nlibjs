import {isString} from './isString';
export const isNonEmptyString = (x: any): x is string => isString(x) && 0 < x.length;
