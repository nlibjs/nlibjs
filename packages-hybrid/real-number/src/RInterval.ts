import {Error} from '@nlib/global';
import {
    gt,
    gte,
    lt,
    lte,
    RCut,
} from './RCut';
import {RClass, RTypes, RSetLike} from './types';

/** A set of real numbers between the left and right endpoints. */
export class RInterval implements RClass, RSetLike {

    public readonly type: RTypes.RInterval

    public readonly leftEnd: RCut

    public readonly rightEnd: RCut

    public constructor(leftEnd: RCut, rightEnd: RCut) {
        if (leftEnd.number <= rightEnd.number) {
            this.type = RTypes.RInterval;
            this.leftEnd = leftEnd;
            this.rightEnd = rightEnd;
        } else {
            throw new Error(`leftEnd ${leftEnd.number} should be lower than rightEnd ${rightEnd.number}`);
        }
    }

    /** left-opened, right-opened */
    public static openopen(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gt(leftEnd), lt(rightEnd));
    }

    /** left-opened, right-closed */
    public static openclose(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gt(leftEnd), lte(rightEnd));
    }

    /** left-closed, right-opened */
    public static closeopen(leftEnd: number, rightEnd: number): RInterval {
        return new RInterval(gte(leftEnd), lt(rightEnd));
    }

    /** left-closed, right-closed */
    public static closeclose(leftEnd: number, rightEnd: number): RInterval {
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
        if (r1 < l2 || (r1 === l2 && (rightEnd1.opened || leftEnd2.opened))) {
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
        if (r1 < l2 || (r1 === l2 && rightEnd1.opened && leftEnd2.opened)) {
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
            leftEnd: {number: l, opened: lo},
            rightEnd: {number: r, opened: ro},
        } = this;
        return `${lo ? '(' : '['}${l}, ${r}${ro ? ')' : ']'}`;
    }

}

export const {
    openopen,
    openclose,
    closeopen,
    closeclose,
} = RInterval;

export type NullableRIntervalList = Iterable<Nullable<RInterval>>;
