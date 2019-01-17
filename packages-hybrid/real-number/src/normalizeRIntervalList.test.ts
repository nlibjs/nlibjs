import test from 'ava';
import * as index from './index';
import {normalizeRIntervalList} from './normalizeRIntervalList';
import {inin, inex, exin, exex, equalI} from './RInterval';

test('index.normalizeRIntervalList', (t) => {
    t.is(index.normalizeRIntervalList, normalizeRIntervalList);
});

test('[0, 1] (1, 2] [2, 3) (3, 3) (3, 4) [4, 5] → [0, 3) (3, 5]', (t) => {
    const result = normalizeRIntervalList([
        inin(4, 5),
        exex(3, 4),
        inex(2, 3),
        exin(1, 2),
        inin(0, 1),
        exex(3, 3),
    ]);
    t.is(result.length, 2);
    t.true(equalI(result[0], inex(0, 3)));
    t.true(equalI(result[1], exin(3, 5)));
});

test('[0, 1] (1, 2] [2, 3) (3, 3) (3, 4) [4, 5] [3, 3] → [0, 5]', (t) => {
    const result = normalizeRIntervalList([
        inin(4, 5),
        exex(3, 4),
        inex(2, 3),
        exin(1, 2),
        inin(0, 1),
        inin(3, 3),
        exex(3, 3),
    ]);
    t.is(result.length, 1);
    t.true(equalI(result[0], inin(0, 5)));
});
