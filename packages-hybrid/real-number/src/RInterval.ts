import {Error, Nullable} from '@nlib/global';
import {gt, gte, lt, lte, RCut} from './RCut';
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
        return new RInterval(gt(leftEnd), lt(rightEnd));
    }

    /** left-exclusive, right-inclusive */
    public static exin(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gt(leftEnd), lte(rightEnd));
    }

    /** left-inclusive, right-exclusive */
    public static inex(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gte(leftEnd), lt(rightEnd));
    }

    /** left-inclusive, right-inclusive */
    public static inin(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gte(leftEnd), lte(rightEnd));
    }

    public static equal(i1: RInterval, i2: RInterval): boolean {
        return i1 && i2 && RCut.equal(i1.leftEnd, i2.leftEnd) && RCut.equal(i1.rightEnd, i2.rightEnd);
    }

    public static compareFunction(
        {leftEnd: leftEnd1, rightEnd: rightEnd1}: RInterval,
        {leftEnd: leftEnd2, rightEnd: rightEnd2}: RInterval,
    ): 1 | 0 | -1 {
        const result = RCut.compareFunction(leftEnd1, leftEnd2);
        if (result === 0) {
            return RCut.compareFunction(rightEnd1, rightEnd2);
        } else {
            return result;
        }
    }

    /** Returns the intersection of two Rintervals. */
    public static intersection(i1: RInterval, i2: RInterval): RInterval | null {
        const [
            {rightEnd: rightEnd1},
            {leftEnd: leftEnd2, rightEnd: rightEnd2},
        ] = [i1, i2].sort(RInterval.compareFunction);
        const {number: r1} = rightEnd1;
        const {number: l2} = leftEnd2;
        if (r1 < l2 || (r1 === l2 && (rightEnd1.exclusive || leftEnd2.exclusive))) {
            return null;
        }
        return new RInterval(leftEnd2, [rightEnd1, rightEnd2].sort(RCut.compareFunction)[0]);
    }

    /** Returns the (connected) union of two Rintervals.
     * If the union is not connected, it returns null. */
    public static union = (i1: RInterval, i2: RInterval): RInterval | null => {
        const [
            {leftEnd: leftEnd1, rightEnd: rightEnd1},
            {leftEnd: leftEnd2, rightEnd: rightEnd2},
        ] = [i1, i2].sort(RInterval.compareFunction);
        const {number: r1} = rightEnd1;
        const {number: l2} = leftEnd2;
        if (r1 < l2 || (r1 === l2 && rightEnd1.exclusive && leftEnd2.exclusive)) {
            return null;
        }
        return new RInterval(leftEnd1, [rightEnd1, rightEnd2].sort(RCut.compareFunction)[1]);
    };

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

export const {
    exex,
    exin,
    inex,
    inin,
} = RInterval;

export type NullableRIntervalList = Iterable<Nullable<RInterval>>;
