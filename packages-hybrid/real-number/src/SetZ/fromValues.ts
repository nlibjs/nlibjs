import {Number, Error} from '@nlib/global';
import {IntervalZ} from '../IntervalZ';
import {SetZ} from './types';
import {normalizeSetZ} from './normalize';
export const fromValuesSetZ = (...values: Array<number>): SetZ => normalizeSetZ(values.map<IntervalZ>((value) => {
    if (Number.isInteger(value)) {
        return [value, value];
    }
    throw new Error(`The given value (${value}) is not an integer.`);
}));
