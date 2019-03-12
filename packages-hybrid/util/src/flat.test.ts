import test from 'ava';
import {flat} from './flat';
import * as index from './index';

test('index.flat', (t) => {
    t.is(index.flat, flat);
});

test('flatenate number | number[]', (t) => {
    const result = flat<number>([1, [2, 3], 4, [5], []]);
    t.deepEqual(result, [1, 2, 3, 4, 5]);
});
