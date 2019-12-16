import test from 'ava';
import {sortIntervalZ, sortIntervalZ2} from './sort';
import {IntervalZ} from './types';
import {stringifyIntervalZ} from './stringify';

const tests: Array<[Array<IntervalZ>, Array<IntervalZ>]> = [
    [
        [
            [-4, 5],
            [-5, 5],
        ],
        [
            [-5, 5],
            [-4, 5],
        ],
    ],
    [
        [
            [-5, 5],
            [-5, 4],
        ],
        [
            [-5, 4],
            [-5, 5],
        ],
    ],
];

for (const [list, expected] of tests) {
    test(`${list.map(stringifyIntervalZ).join('')} → ${expected.map(stringifyIntervalZ).join('-')}`, (t) => {
        t.deepEqual(list.sort(sortIntervalZ), expected);
        t.deepEqual(expected.sort(sortIntervalZ), expected);
        if (list.length === 2) {
            t.deepEqual(sortIntervalZ2(list[0], list[1]), expected);
        }
    });
}
