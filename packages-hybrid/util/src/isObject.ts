import {getType} from './getType';

export const isObject = <TType = {}>(x: any): x is TType => getType(x) === 'Object';
