import {Infinity, Nullable} from '@nlib/global';
import {RInterval, NullableRIntervalList, equalI, intersectionI} from './RInterval';
import {normalizeRIntervalList} from './normalizeRIntervalList';
import {RCut, gt, lt, complementC} from './RCut';
import {INumberSetBase, SetTypes, ISetLike} from './types';

export class RSet implements INumberSetBase, ISetLike<RInterval> {

    public readonly type: SetTypes.RSet

    public readonly intervals: ReadonlyArray<RInterval>

    protected constructor(intervals: NullableRIntervalList) {
        this.type = SetTypes.RSet;
        this.intervals = normalizeRIntervalList(intervals);
    }

    public static equal({intervals: intervals1}: RSet, {intervals: intervals2}: RSet): boolean {
        return intervals1.length === intervals2.length
        && intervals1.every((interval, index) => equalI(interval, intervals2[index]));
    }

    public static empty(): RSet {
        return new this([]);
    }

    public static fromInterval(interval: RInterval): RSet {
        return new this([interval]);
    }

    public static complement(set: RSet): RSet {
        const inverse: Array<RInterval> = [];
        let pos: RCut = gt(-Infinity);
        for (const {leftEnd, rightEnd} of set.intervals) {
            inverse.push(new RInterval(pos, complementC(leftEnd)));
            pos = complementC(rightEnd);
        }
        inverse.push(new RInterval(pos, lt(Infinity)));
        return new this(inverse);
    }

    public static union(...items: Array<RSet | RInterval>): RSet {
        const intervals: Array<RInterval> = [];
        for (const item of items) {
            intervals.push(...item.intervals);
        }
        return new this(intervals);
    }

    public static intersection(...items: Array<RSet | RInterval>): RSet {
        const {intervals} = items.reduce(({intervals: intervals1}, {intervals: intervals2}) => {
            const intervals: Array<Nullable<RInterval>> = [];
            for (const interval1 of intervals1) {
                intervals.push(...intervals2.map((interval2) => intersectionI(interval1, interval2)));
            }
            return new this(intervals);
        });
        return new this(intervals);
    }

    public get isEmpty(): boolean {
        return this.intervals.length === 0;
    }

    public has(x: number): boolean {
        return !this.isEmpty && this.intervals.some((interval) => interval.has(x));
    }

    public toString(): string {
        return `{${this.intervals.map<string>((interval) => `${interval}`).join('')}}`;
    }

}

export const equalR = RSet.equal.bind(RSet);
export const emptyR = RSet.empty.bind(RSet);
export const fromIntervalR = RSet.fromInterval.bind(RSet);
export const complementR = RSet.complement.bind(RSet);
export const unionR = RSet.union.bind(RSet);
export const intersectionR = RSet.intersection.bind(RSet);
