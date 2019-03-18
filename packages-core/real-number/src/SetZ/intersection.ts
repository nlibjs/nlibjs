import {intersectionIntervalZ} from '../IntervalZ';
import {SetZ} from './types';
import {normalizeSetZ} from './normalize';

export const intersectionSetZ = (...sets: Array<SetZ>): SetZ => {
    let result: SetZ | undefined = sets.shift();
    if (!result) {
        return [];
    }
    for (const set of sets) {
        const newResult: SetZ = [];
        let newResultLength = 0;
        for (const interval of set) {
            for (const resultInterval of result) {
                const intersection = intersectionIntervalZ(interval, resultInterval);
                if (intersection) {
                    newResult[newResultLength++] = intersection;
                }
            }
        }
        result = newResult;
    }
    return normalizeSetZ(result);
};
