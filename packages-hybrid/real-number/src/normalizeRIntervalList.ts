import {RInterval, NullableRIntervalList} from './RInterval';

const filterNullAndSort = (nullableIntervalList: NullableRIntervalList): Array<RInterval> => {
    const intervals: Array<RInterval> = [];
    for (const item of nullableIntervalList) {
        if (item) {
            intervals.push(item);
        }
    }
    return intervals.sort(RInterval.compareFunction);
};

export const normalizeRIntervalList = (nullableIntervalList: NullableRIntervalList): Array<RInterval> => {
    const normalized: Array<RInterval> = [];
    let currentInterval: RInterval | null = null;
    for (const interval of filterNullAndSort(nullableIntervalList)) {
        if (interval && !interval.isEmpty) {
            if (currentInterval) {
                const union = RInterval.union(currentInterval, interval);
                if (union) {
                    currentInterval = union;
                } else {
                    normalized.push(currentInterval);
                    currentInterval = interval;
                }
            } else {
                currentInterval = interval;
            }
        }
    }
    if (currentInterval) {
        normalized.push(currentInterval);
    }
    return normalized;
};
