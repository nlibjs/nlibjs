import {
    unionIntervalZ,
    sortIntervalZ,
} from '../IntervalZ';
import {SetZ} from './types';

export const normalizeSetZ = (set: SetZ): SetZ => {
    const result: SetZ = [];
    let resultLength = 0;
    for (const interval of set) {
        let consumed = false;
        for (let index = 0; index < resultLength; index++) {
            const consumedInterval = result[index];
            let union = unionIntervalZ(interval, consumedInterval);
            if (union) {
                result[index] = union;
                for (let index2 = index + 1; index2 < resultLength; index2++) {
                    const union2 = unionIntervalZ(union, result[index2]);
                    if (union2) {
                        union = union2;
                        result.splice(index, 2, union);
                        resultLength--;
                    } else {
                        break;
                    }
                }
                for (let index2 = index - 1; 0 < index2; index2--) {
                    const union2 = unionIntervalZ(union, result[index2]);
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
            } else if (sortIntervalZ(interval, consumedInterval) <= 0) {
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
    return result;
};
