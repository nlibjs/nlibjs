import {Error} from '@nlib/global';
import {isObject} from 'util';

export interface INlibErrorParameters<TData> {
    code: string | number,
    message: string,
    data: TData,
}

export class NlibError<TData> extends Error {

    public readonly code: string | number;

    public readonly data: TData;

    public constructor(parameters: INlibErrorParameters<TData>) {
        super(parameters.message);
        this.code = parameters.code;
        this.data = parameters.data;
    }

}

export const isNlibError = <TData>(x: any): x is NlibError<TData> => isObject(x) && x.constructor.name === 'NlibError';
