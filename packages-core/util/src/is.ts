import {getType} from './getType';
export interface ITypeFilter<TType> {
    (x: any): x is TType,
}
export const createTypeFilter = <TType>(type: string): ITypeFilter<TType> => (x): x is TType => getType(x) === type;
export const isNumber = (x: any): x is number => getType(x) === 'Number';
export const isObject = <TType = {}>(x: any): x is TType => getType(x) === 'Object';
export const isString = (x: any): x is string => getType(x) === 'String';
