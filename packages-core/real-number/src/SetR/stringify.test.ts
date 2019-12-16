import test from 'ava';
import {stringifySetR} from './stringify';

test('stringifySetR', (t) => {
    t.is(
        stringifySetR([
            [true, 1, 2, false],
            [false, 3, 4, true],
        ]),
        '{[1, 2) (3, 4]}',
    );
});
