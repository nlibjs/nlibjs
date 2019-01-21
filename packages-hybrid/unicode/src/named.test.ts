import test from 'ava';
import * as named from './named';

test('named', (t) => {
    t.true(0 < Object.keys(named).length);
});
