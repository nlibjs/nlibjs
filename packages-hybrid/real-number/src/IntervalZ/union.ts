import {IntervalZ} from './types';

export const unionIntervalZ = (...IntervalZs: Array<IntervalZ>): IntervalZ | null => {
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
        const l = next[0] - 1;
        const r = next[1] + 1;
        if (l < left ? r < left : right < l) {
            return null;
        }
        if (l < left) {
            left = next[0];
        }
        if (right < r) {
            right = next[1];
        }
    }
    return [left, right];
};
