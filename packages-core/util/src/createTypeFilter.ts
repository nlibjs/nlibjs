import {getType} from './getType';
export interface ITypeFilter<TType> {
    (x: any): x is TType,
}
export const createTypeFilter = <TType>(type: string): ITypeFilter<TType> => (x): x is TType => getType(x) === type;
