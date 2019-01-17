import test from 'ava';
import * as index from './index';
import {Bytes} from './4.3.Bytes';

test('index', (t) => {
    t.is(index.Bytes, Bytes);
});

test('Bytes', (t) => {
    t.false(Bytes.has(-1));
    t.true(Bytes.has(0));
    t.false(Bytes.has(0.1));
    t.true(Bytes.has(255));
    t.false(Bytes.has(256));
});
