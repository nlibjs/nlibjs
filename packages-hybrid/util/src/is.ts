import {getType} from './getType';

export const isNumber = (x: any): x is number => getType(x) === 'Number';

export const isObject = <TType = {}>(x: any): x is TType => getType(x) === 'Object';

export const isString = (x: any): x is string => getType(x) === 'String';
