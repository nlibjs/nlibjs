import {Error} from '@nlib/global';
import {IndicatorFunction} from './types';

export class Set {

    private _indicator: IndicatorFunction

    public constructor(indicator: IndicatorFunction) {
        this._indicator = indicator;
    }

    public has(x: any): boolean {
        return this._indicator(x);
    }

    public filter(x: any): Set {
        if (this.has(x)) {
            return x as Set;
        }
        throw new Error(`Invalid item: ${x}`);
    }

}
