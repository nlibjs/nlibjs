import {intersectionIntervalR} from '../IntervalR';
import {SetR} from './types';
import {normalizeSetR} from './normalize';

export const intersectionSetR = (...sets: Array<SetR>): SetR => {
    let result: SetR | undefined = sets.shift();
    if (!result) {
        return [];
    }
    for (const set of sets) {
        const newResult: SetR = [];
        let newResultLength = 0;
        for (const interval of set) {
            for (const resultInterval of result) {
                const intersection = intersectionIntervalR(interval, resultInterval);
                if (intersection) {
                    newResult[newResultLength++] = intersection;
                }
            }
        }
        result = newResult;
    }
    return normalizeSetR(result);
};
