import {getType} from './getType';

export const isString = (x: any): x is string => getType(x) === 'String';
