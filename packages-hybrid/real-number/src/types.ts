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
