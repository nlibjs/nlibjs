import {Error} from '@nlib/global';

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
