import {isNull} from './isNull';
export const isObject = (x: any): x is {[key: string]: any} => typeof x === 'object' && !isNull(x);
