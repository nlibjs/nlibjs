import {Object} from '@nlib/global';
import {Set} from './Set';
import {RelationIndicatorFunction} from './types';

export interface IBinaryRelationTypes {
    /** For all x and z in X and y in Y it holds that if xRy and zRy then x = z. */
    readonly leftUnique: boolean,
    /** For all x in X, and y and z in Y it holds that if xRy and xRz then y = z */
    readonly rightUnique: boolean,
    /** For all x in X there exists a y in Y such that xRy. */
    readonly leftTotal: boolean,
    /** For all y in Y there exists an x in X such that xRy. */
    readonly rightTotal: boolean,

    /** For all x in X it holds that xRx. */
    readonly reflexive: boolean,
    /** For all x in X it holds that not xRx. */
    readonly irreflexive: boolean,
    /** For all x and y in X it holds that if xRy then x = y. */
    readonly coreflexive: boolean,
    /** For all x and y in X it holds that if xRy then yRx. */
    readonly symmetric: boolean,
    /** For all x and y in X, if xRy and yRx then x = y. */
    readonly antisymmetric: boolean,
    /** For all x and y in X, if xRy then not yRx. */
    readonly asymmetric: boolean,
    /** For all x, y and z in X it holds that if xRy and yRz then xRz. */
    readonly transitive: boolean,
    /** For all x and y in X it holds that xRy or yRx (or both). */
    readonly connex: boolean,
    /** For all x and y in X exactly one of xRy, yRx or x = y holds. */
    readonly trichotomous: boolean,
    /** For all x, y and z in X, if xRy and xRz, then yRz. */
    readonly rightEuclidean: boolean,
    /** For all x, y and z in X, if yRx and zRx, then yRz. */
    readonly leftEuclidean: boolean,
    /** For all x in X, there exists y in X such that xRy. */
    readonly serial: boolean,
    /** For every x in X, the class of all y such that yRx is a set. */
    readonly setLike: boolean,
    /** Every nonempty subset S of X contains a minimal element with respect to R. */
    readonly wellFounded: boolean,
}

export interface IBinaryRelationInit {
    readonly set1: Set,
    readonly set2: Set,
    readonly indicator: RelationIndicatorFunction,
    readonly types: IBinaryRelationTypes,
}

export class BinaryRelation extends Function {

    public readonly set1: Set

    public readonly set2: Set

    public readonly indicator: RelationIndicatorFunction

    public readonly types: IBinaryRelationTypes

    public constructor(init: IBinaryRelationInit) {
        super();
        this.set1 = init.set1;
        this.set2 = init.set2;
        this.indicator = init.indicator;
        this.types = init.types;
        const self = Object.setPrototypeOf(
            (x: any, y: any) => self.calculate(x, y),
            Object.getPrototypeOf(this),
        );
        return self;
    }

    public calculate(x: any, y: any): boolean {
        return this.indicator(this.set1.filter(x), this.set2.filter(y));
    }

    public get isLeftUnique(): boolean {
        return this.types.leftUnique;
    }

    public get isRightUnique(): boolean {
        return this.types.rightUnique;
    }

    public get isOneToOne(): boolean {
        return this.isLeftUnique && this.isRightUnique;
    }

    public get isLeftTotal(): boolean {
        return this.types.leftTotal;
    }

    public get isRightTotal(): boolean {
        return this.types.rightTotal;
    }

    public get isCorrespondence(): boolean {
        return this.isLeftTotal && this.isRightTotal;
    }

    public get isFunction(): boolean {
        return this.isRightUnique && this.isLeftTotal;
    }

    public get isInjection(): boolean {
        return this.isFunction && this.isLeftUnique;
    }

    public get isSurjection(): boolean {
        return this.isFunction && this.isRightTotal;
    }

    public get isBijection(): boolean {
        return this.isOneToOne && this.isCorrespondence;
    }

    public get isReflexive(): boolean {
        return this.types.reflexive;
    }

    public get isIrreflexive(): boolean {
        return this.types.irreflexive;
    }

    public get isCoreflexive(): boolean {
        return this.types.coreflexive;
    }

    public get isSymmetric(): boolean {
        return this.types.symmetric;
    }

    public get isAntisymmetric(): boolean {
        return this.types.antisymmetric;
    }

    public get isAsymmetric(): boolean {
        return this.types.asymmetric;
    }

    public get isTransitive(): boolean {
        return this.types.transitive;
    }

    public get isConnex(): boolean {
        return this.types.connex;
    }

    public get isTrichotomous(): boolean {
        return this.types.trichotomous;
    }

    public get isRightEuclidean(): boolean {
        return this.types.rightEuclidean;
    }

    public get isLeftEuclidean(): boolean {
        return this.types.leftEuclidean;
    }

    public get isSerial(): boolean {
        return this.types.serial;
    }

    public get isSetLike(): boolean {
        return this.types.setLike;
    }

    public get isWellFounded(): boolean {
        return this.types.wellFounded;
    }

    public get isEquivalence(): boolean {
        return this.isReflexive && this.isSymmetric && this.isTransitive;
    }

    public get isPartialEquivalence(): boolean {
        return this.isSymmetric && this.isTransitive;
    }

    public get isPartialOrder(): boolean {
        return this.isReflexive && this.isAntisymmetric && this.isTransitive;
    }

    public get isTotalOrder(): boolean {
        return this.isPartialOrder && this.isConnex;
    }

}
