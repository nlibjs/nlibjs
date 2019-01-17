import {Number} from '@nlib/global';
import {RSet} from './RSet';

export class ZSet extends RSet {

    public has(x: number): boolean {
        return !this.isEmpty && Number.isInteger(x) && this.intervals.some((interval) => interval.has(x));
    }

}

export const equalZ = ZSet.equal.bind(ZSet);
export const emptyZ = ZSet.empty.bind(ZSet);
export const fromIntervalZ = ZSet.fromInterval.bind(ZSet);
export const complementZ = ZSet.complement.bind(ZSet);
export const unionZ = ZSet.union.bind(ZSet);
export const intersectionZ = ZSet.intersection.bind(ZSet);
