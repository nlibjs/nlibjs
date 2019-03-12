import {getType} from './getType';

export const isNumber = (x: any): x is number => getType(x) === 'Number';
