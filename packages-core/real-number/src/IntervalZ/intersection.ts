import {IntervalZ} from './types';

export const intersectionIntervalZ = (...IntervalZs: Array<IntervalZ>): IntervalZ | null => {
    const first = IntervalZs.shift();
    if (!first) {
        return null;
    }
    let [left, right] = first;
    while (1) {
        const next = IntervalZs.shift();
        if (!next) {
            break;
        }
        const [l, r] = next;
        if (left < l) {
            left = l;
        }
        if (r < right) {
            right = r;
        }
        if (right < left) {
            return null;
        }
    }
    return [left, right];
};
