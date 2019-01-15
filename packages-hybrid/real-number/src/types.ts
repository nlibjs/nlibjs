import {Error} from '@nlib/global';

export enum SetTypes {
    RCut,
    RInterval,
    RSet,
    NCut,
    NInterval,
    NSet,
}

export interface INumberSetBase {
    readonly type: SetTypes,
}

export interface ISetLike<TInterval> {
    readonly intervals: ReadonlyArray<TInterval>,
    isEmpty: boolean,
    has(x: number): boolean,
    toString(): string,
}

// https://github.com/Microsoft/TypeScript/issues/14600
export const testSetLikeConstructor = (Constructor: {}): void => {
    if (!('union' in Constructor)) {
        throw new Error('.union() is not implemented');
    }
    if (!('intersection' in Constructor)) {
        throw new Error('.intersection() is not implemented');
    }
    if (!('equal' in Constructor)) {
        throw new Error('.equal() is not implemented');
    }
};
