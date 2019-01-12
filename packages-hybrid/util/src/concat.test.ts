import test from 'ava';
import {concat} from './concat';
import * as index from './index';

test('index.concat', (t) => {
    t.is(index.concat, concat);
});

test('concatenate number | number[]', (t) => {
    const result = concat<number>([1, [2, 3], 4, [5], []]);
    t.deepEqual(result, [1, 2, 3, 4, 5]);
});
