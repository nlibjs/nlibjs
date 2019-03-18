import test from 'ava';
import {stringifySetZ} from './stringify';
import * as index from './index';

test('index.stringifySetZ', (t) => {
    t.is(index.stringifySetZ, stringifySetZ);
});

