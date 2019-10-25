import {getType} from './getType';
export interface ITypeFilter<TType> {
    (x: any): x is TType,
}
export const isNull = (x: any): x is null => x === null;
export const isNumber = (x: any): x is number => getType(x) === 'Number';
export const isObject = <TType = {[key: string]: any}>(x: any): x is TType => getType(x) === 'Object';
export const isString = (x: any): x is string => getType(x) === 'String';
export const isNonEmptyString = (x: any): x is string => isString(x) && 0 < x.length;
