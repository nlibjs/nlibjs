import {Error} from '@nlib/global';
import {RInterval} from './RInterval';

export enum RTypes {
    RCut,
    RInterval,
    RSet,
}

export interface RClass {
    readonly type: RTypes,
}

export interface RSetLike {
    readonly intervals: ReadonlyArray<RInterval>,
    isEmpty: boolean,
    has(x: number): boolean,
    toString(): string,
}

// https://github.com/Microsoft/TypeScript/issues/14600
export const testRSetLikeConstructor = (Constructor: {}): void => {
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
