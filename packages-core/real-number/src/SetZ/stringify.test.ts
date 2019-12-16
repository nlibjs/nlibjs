import test from 'ava';
import {stringifySetZ} from './stringify';

test('stringifySetZ', (t) => {
    t.is(
        stringifySetZ([
            [1, 2],
            [3, 4],
        ]),
        '{[1, 2] [3, 4]}',
    );
});

