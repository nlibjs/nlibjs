import {
    unionIntervalR,
    sortIntervalR,
} from '../IntervalR';
import {SetR} from './types';

export const normalizeSetR = (set: SetR): SetR => {
    const result: SetR = [];
    let resultLength = 0;
    for (const interval of set) {
        if (interval[1] !== interval[2] || (interval[0] && interval[3])) {
            let consumed = false;
            for (let index = 0; index < resultLength; index++) {
                const consumedInterval = result[index];
                let union = unionIntervalR(interval, consumedInterval);
                if (union) {
                    result[index] = union;
                    for (let index2 = index + 1; index2 < resultLength; index2++) {
                        const union2 = unionIntervalR(union, result[index2]);
                        if (union2) {
                            union = union2;
                            result.splice(index, 2, union);
                            resultLength--;
                        } else {
                            break;
                        }
                    }
                    for (let index2 = index - 1; 0 < index2; index2--) {
                        const union2 = unionIntervalR(union, result[index2]);
                        if (union2) {
                            union = union2;
                            result.splice(index2, 2, union);
                            resultLength--;
                        } else {
                            break;
                        }
                    }
                    consumed = true;
                    break;
                } else if (sortIntervalR(interval, consumedInterval) <= 0) {
                    result.splice(index, 0, interval);
                    resultLength++;
                    consumed = true;
                    break;
                }
            }
            if (!consumed) {
                result[resultLength++] = interval;
            }
        }
    }
    return result;
};
