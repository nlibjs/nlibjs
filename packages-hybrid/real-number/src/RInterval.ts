import {Error, Nullable} from '@nlib/global';
import {gt, gte, lt, lte, RCut, equalC, compareFunctionC} from './RCut';
import {INumberSetBase, SetTypes, ISetLike} from './types';

/** A set of real numbers between the left and right endpoints. */
export class RInterval implements INumberSetBase, ISetLike<RInterval> {

    public readonly type: SetTypes.RInterval

    public readonly leftEnd: RCut

    public readonly rightEnd: RCut

    public constructor(leftEnd: RCut, rightEnd: RCut) {
        if (leftEnd.number <= rightEnd.number) {
            this.type = SetTypes.RInterval;
            this.leftEnd = leftEnd;
            this.rightEnd = rightEnd;
        } else {
            throw new Error(`leftEnd ${leftEnd.number} should be lower than rightEnd ${rightEnd.number}`);
        }
    }

    /** left-exclusive, right-exclusive */
    public static exex(leftEnd: number, rightEnd: number): RInterval {
        return new this(gt(leftEnd), lt(rightEnd));
    }

    /** left-exclusive, right-inclusive */
    public static exin(leftEnd: number, rightEnd: number): RInterval {
        return new this(gt(leftEnd), lte(rightEnd));
    }

    /** left-inclusive, right-exclusive */
    public static inex(leftEnd: number, rightEnd: number): RInterval {
        return new this(gte(leftEnd), lt(rightEnd));
    }

    /** left-inclusive, right-inclusive */
    public static inin(leftEnd: number, rightEnd: number): RInterval {
        return new this(gte(leftEnd), lte(rightEnd));
    }

    /** point */
    public static eq(value: number): RInterval {
        return RInterval.inin(value, value);
    }

    public static equal(interval1: RInterval, interval2: RInterval): boolean {
        return interval1
        && interval2
        && equalC(interval1.leftEnd, interval2.leftEnd)
        && equalC(interval1.rightEnd, interval2.rightEnd);
    }

    public static compareFunction(
        {leftEnd: leftEnd1, rightEnd: rightEnd1}: RInterval,
        {leftEnd: leftEnd2, rightEnd: rightEnd2}: RInterval,
    ): 1 | 0 | -1 {
        const result = compareFunctionC(leftEnd1, leftEnd2);
        if (result === 0) {
            return compareFunctionC(rightEnd1, rightEnd2);
        } else {
            return result;
        }
    }

    /** Returns the intersection of two Rintervals. */
    public static intersection(interval1: RInterval, interval2: RInterval): RInterval | null {
        const [
            {rightEnd: rightEnd1},
            {leftEnd: leftEnd2, rightEnd: rightEnd2},
        ] = [interval1, interval2].sort(RInterval.compareFunction);
        const {number: r1} = rightEnd1;
        const {number: l2} = leftEnd2;
        if (r1 < l2 || (r1 === l2 && (rightEnd1.exclusive || leftEnd2.exclusive))) {
            return null;
        }
        return new this(leftEnd2, [rightEnd1, rightEnd2].sort(compareFunctionC)[0]);
    }

    /** Returns the (connected) union of two Rintervals.
     * If the union is not connected, it returns null. */
    public static union(interval1: RInterval, interval2: RInterval): RInterval | null {
        const [
            {leftEnd: leftEnd1, rightEnd: rightEnd1},
            {leftEnd: leftEnd2, rightEnd: rightEnd2},
        ] = [interval1, interval2].sort(RInterval.compareFunction);
        const {number: r1} = rightEnd1;
        const {number: l2} = leftEnd2;
        if (r1 < l2 || (r1 === l2 && rightEnd1.exclusive && leftEnd2.exclusive)) {
            return null;
        }
        return new this(leftEnd1, [rightEnd1, rightEnd2].sort(compareFunctionC)[1]);
    }

    public has(x: number): boolean {
        return this.leftEnd.has(x) && this.rightEnd.has(x);
    }

    public get isEmpty(): boolean {
        const {leftEnd, rightEnd} = this;
        return leftEnd.number === rightEnd.number && !this.has(leftEnd.number);
    }

    public get intervals(): ReadonlyArray<RInterval> {
        return [this];
    }

    public toString(): string {
        const {
            leftEnd: {number: l, exclusive: lExclusive},
            rightEnd: {number: r, exclusive: rExclusive},
        } = this;
        return `${lExclusive ? '(' : '['}${l}, ${r}${rExclusive ? ')' : ']'}`;
    }

}

export type NullableRIntervalList = Iterable<Nullable<RInterval>>;
export const exex = RInterval.exex.bind(RInterval);
export const exin = RInterval.exin.bind(RInterval);
export const inex = RInterval.inex.bind(RInterval);
export const inin = RInterval.inin.bind(RInterval);
export const eq = RInterval.eq.bind(RInterval);
export const equalI = RInterval.equal.bind(RInterval);
export const compareFunctionI = RInterval.compareFunction.bind(RInterval);
export const intersectionI = RInterval.intersection.bind(RInterval);
export const unionI = RInterval.union.bind(RInterval);
