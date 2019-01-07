import test from 'ava';
import {httpGet} from './httpGet';
import * as index from '.';

test('index.httpGet', (t) => {
    t.is(index.httpGet, httpGet);
});

test('request http://httpbin.org/headers', async (t) => {
    const res = await httpGet('http://httpbin.org/headers');
    t.is(res.statusCode, 200);
});

test('request https://httpbin.org/headers', async (t) => {
    const res = await httpGet('https://httpbin.org/headers');
    t.is(res.statusCode, 200);
});
