import {Number, Error} from '@nlib/global';
import {INumberSetBase, SetTypes} from './types';
const GTE = 0;
const GT = 1;
const LT = 2;
const LTE = 3;
type Operator = typeof GT | typeof GTE | typeof LT | typeof LTE;
type Comparator = (x: number) => boolean;

/** A set of real numbers gt, gte, lt or lte than the given number. */
export class RCut implements INumberSetBase {

    public readonly type: SetTypes.RCut

    public readonly number: number

    public readonly operator: Operator

    public readonly exclusive: boolean

    public readonly onRight: boolean

    public readonly has: Comparator

    public constructor(number: number, operator: Operator) {
        if (Number.isNaN(number)) {
            throw new Error('The given number is NaN');
        }
        let onRight = false;
        let exclusive = false;
        let has: Comparator;
        switch (operator) {
        case GT:
            onRight = true;
            exclusive = true;
            has = (x) => number < x;
            break;
        case GTE:
            if (!Number.isFinite(number)) {
                throw new Error(`A RCut at ${number} cannot be closed`);
            }
            onRight = true;
            has = (x) => number <= x;
            break;
        case LT:
            exclusive = true;
            has = (x) => x < number;
            break;
        case LTE:
            if (!Number.isFinite(number)) {
                throw new Error(`A RCut at ${number} cannot be closed`);
            }
            has = (x) => x <= number;
            break;
        default:
            throw new Error(`Invalid operator: ${operator}`);
        }
        this.type = SetTypes.RCut;
        this.number = number;
        this.operator = operator;
        this.exclusive = exclusive;
        this.onRight = onRight;
        this.has = has;
    }

    public static gt(number: number): RCut {
        return new this(number, GT);
    }

    public static gte(number: number): RCut {
        return new this(number, GTE);
    }

    public static lt(number: number): RCut {
        return new this(number, LT);
    }

    public static lte(number: number): RCut {
        return new this(number, LTE);
    }

    public static equal(c1: RCut, c2: RCut): boolean {
        return c1 && c2 && c1.number === c2.number && c1.operator === c2.operator;
    }

    public static compareFunction(
        {number: n1, operator: o1}: RCut,
        {number: n2, operator: o2}: RCut,
    ): 1 | 0 | -1 {
        if (n1 === n2) {
            if (o1 === o2) {
                return 0;
            }
            return o1 < o2 ? -1 : 1;
        }
        return n1 < n2 ? -1 : 1;
    }

    public static complement({operator, number}: RCut): RCut {
        switch (operator) {
        case GT:
            return Number.isFinite(number) ? this.lte(number) : this.lt(number);
        case GTE:
            return this.lt(number);
        case LT:
            return Number.isFinite(number) ? this.gte(number) : this.gt(number);
        case LTE:
            return this.gt(number);
        default:
            throw new Error(`Invalid operator: ${operator}`);
        }
    }

    public toString(): string {
        if (this.onRight) {
            return `${this.exclusive ? '(' : '['}${this.number}, Infinity)`;
        }
        return `(-Infinity, ${this.number}${this.exclusive ? ')' : ']'}`;
    }

    public get inclusive(): boolean {
        return !this.exclusive;
    }

    public get onLeft(): boolean {
        return !this.onRight;
    }

}

export const gt = RCut.gt.bind(RCut);
export const gte = RCut.gte.bind(RCut);
export const lt = RCut.lt.bind(RCut);
export const lte = RCut.lte.bind(RCut);
export const equalC = RCut.equal.bind(RCut);
export const compareFunctionC = RCut.compareFunction.bind(RCut);
export const complementC = RCut.complement.bind(RCut);
