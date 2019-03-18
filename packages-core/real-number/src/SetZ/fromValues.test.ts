import test from 'ava';
import {fromValuesSetZ} from './fromValues';
import {SetZ} from './types';
import {stringifySetZ} from './stringify';
import * as index from './index';

test('index.fromValuesSetZ', (t) => {
    t.is(index.fromValuesSetZ, fromValuesSetZ);
});

const tests: Array<[Array<number>, SetZ]> = [
    [
        [0, 1, 2, 3, 4, 6, 7, 8, 9],
        [
            [0, 4],
            [6, 9],
        ],
    ],
];

for (const [input, expected] of tests) {
    test(`[${input.join(', ')}] → ${stringifySetZ(expected)}`, (t) => {
        t.deepEqual(fromValuesSetZ(...input), expected);
    });
}
