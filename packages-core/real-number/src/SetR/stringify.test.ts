import test from 'ava';
import {stringifySetR} from './stringify';
import * as index from './index';

test('index.stringifySetR', (t) => {
    t.is(index.stringifySetR, stringifySetR);
});
