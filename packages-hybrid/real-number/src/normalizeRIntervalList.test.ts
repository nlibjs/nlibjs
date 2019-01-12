import test from 'ava';
import * as index from './index';
import {normalizeRIntervalList} from './normalizeRIntervalList';
import {closeclose, closeopen, RInterval, openclose, openopen} from './RInterval';

test('index.normalizeRIntervalList', (t) => {
    t.is(index.normalizeRIntervalList, normalizeRIntervalList);
});

test('[0, 1] (1, 2] [2, 3) (3, 3) (3, 4) [4, 5] → [0, 3) (3, 5]', (t) => {
    const result = normalizeRIntervalList([
        closeclose(4, 5),
        openopen(3, 4),
        closeopen(2, 3),
        openclose(1, 2),
        closeclose(0, 1),
        openopen(3, 3),
    ]);
    t.is(result.length, 2);
    t.true(RInterval.equal(result[0], closeopen(0, 3)));
    t.true(RInterval.equal(result[1], openclose(3, 5)));
});

test('[0, 1] (1, 2] [2, 3) (3, 3) (3, 4) [4, 5] [3, 3] → [0, 5]', (t) => {
    const result = normalizeRIntervalList([
        closeclose(4, 5),
        openopen(3, 4),
        closeopen(2, 3),
        openclose(1, 2),
        closeclose(0, 1),
        closeclose(3, 3),
        openopen(3, 3),
    ]);
    t.is(result.length, 1);
    t.true(RInterval.equal(result[0], closeclose(0, 5)));
});
