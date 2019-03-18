import {Number} from '@nlib/global';
import {NlibError} from '@nlib/util';
import {IntervalZ} from '../IntervalZ';
import {SetZ} from './types';
import {normalizeSetZ} from './normalize';
export const fromValuesSetZ = (...values: Array<number>): SetZ => normalizeSetZ(values.map<IntervalZ>((value, index) => {
    if (Number.isInteger(value)) {
        return [value, value];
    }
    throw new NlibError({
        code: 'EType',
        message: `values[${index}] (${value}) is not an integer.`,
        data: value,
    });
}));
