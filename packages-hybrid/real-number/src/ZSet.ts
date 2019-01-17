import {Number} from '@nlib/global';
import {RSet} from './RSet';

export class ZSet extends RSet {

    public has(x: number): boolean {
        return !this.isEmpty && Number.isInteger(x) && this.intervals.some((interval) => interval.has(x));
    }

}
