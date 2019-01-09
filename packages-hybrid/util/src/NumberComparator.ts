import {Symbol} from '@nlib/global';

const EQ = Symbol('EQ');
const NEQ = Symbol('NEQ');
const LT = Symbol('LT');
const LTE = Symbol('LTE');
const GT = Symbol('GT');
const GTE = Symbol('GTE');
type Operator = typeof EQ | typeof NEQ | typeof LT | typeof LTE | typeof GT | typeof GTE;

export class NumberComparator {

    public static eq(threshold: number) {
        return new NumberComparator(EQ, threshold);
    }

    public static neq(threshold: number) {
        return new NumberComparator(NEQ, threshold);
    }

    public static lt(threshold: number) {
        return new NumberComparator(LT, threshold);
    }

    public static lte(threshold: number) {
        return new NumberComparator(LTE, threshold);
    }

    public static gt(threshold: number) {
        return new NumberComparator(GT, threshold);
    }

    public static gte(threshold: number) {
        return new NumberComparator(GTE, threshold);
    }

    private readonly _operator: Operator

    public readonly threshold: number

    public readonly compare: (x: number) => boolean

    private constructor(operator: Operator, threshold: number) {
        this._operator = operator;
        this.threshold = threshold;
        let compare: typeof NumberComparator.prototype.compare;
        switch (operator) {
        case LT:
            compare = (x) => x < threshold;
            break;
        case LTE:
            compare = (x) => x <= threshold;
            break;
        case GT:
            compare = (x) => threshold < x;
            break;
        case GTE:
            compare = (x) => threshold <= x;
            break;
        case NEQ:
            compare = (x) => x !== threshold;
            break;
        default:
            compare = (x) => x === threshold;
        }
        this.compare = compare;
    }

    public get operator(): string {
        switch (this._operator) {
        case LT:
            return 'lt';
        case LTE:
            return 'lte';
        case GT:
            return 'gt';
        case GTE:
            return 'gte';
        case NEQ:
            return 'neq';
        default:
            return 'eq';
        }
    }

    public is(anotherComparator: NumberComparator): boolean;

    public is(operator: string, threshold: number): boolean;

    public is(comparatorOrOperator: NumberComparator | string, threshold?: number): boolean {
        if (comparatorOrOperator instanceof NumberComparator) {
            return this._operator === comparatorOrOperator._operator && this.threshold === comparatorOrOperator.threshold;
        }
        return this.operator === comparatorOrOperator && this.threshold === threshold;
    }

    public covers(anotherComparator: NumberComparator): boolean {
        if (this._operator === anotherComparator._operator) {
            const {threshold: a} = this;
            const {threshold: b} = anotherComparator;
            switch (this._operator) {
            case LT:
            case LTE:
                return b < a;
            case GT:
            case GTE:
                return a < b;
            default:
                return a === b;
            }
        }
        return false;
    }

    public inverse(): NumberComparator {
        const {threshold} = this;
        switch (this._operator) {
        case LT:
            return new NumberComparator(GTE, threshold);
        case LTE:
            return new NumberComparator(GT, threshold);
        case GT:
            return new NumberComparator(LTE, threshold);
        case GTE:
            return new NumberComparator(LT, threshold);
        case NEQ:
            return new NumberComparator(EQ, threshold);
        default:
            return new NumberComparator(NEQ, threshold);
        }
    }

    public toString(): string {
        return this.compare.toString();
    }

}
