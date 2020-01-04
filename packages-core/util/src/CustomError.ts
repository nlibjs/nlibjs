import {Error} from '@nlib/global';
import {isObject} from 'util';

export interface ICustomErrorParameters {
    code: string | number,
    message: string,
    data: any,
}

export class CustomError extends Error {

    public readonly code: string | number;

    public readonly data: any;

    public constructor(parameters: ICustomErrorParameters) {
        super(parameters.message);
        this.code = parameters.code;
        this.data = parameters.data;
    }

}

export const isCustomError = (
    x: any,
): x is CustomError => isObject(x) && x.constructor.name === 'CustomError';
