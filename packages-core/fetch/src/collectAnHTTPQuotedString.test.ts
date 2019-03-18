import test from 'ava';
import {fromString} from '@nlib/infra';
import {collectAnHTTPQuotedString} from './collectAnHTTPQuotedString';
import * as index from './index';

test('index.collectAnHTTPQuotedString', (t) => {
    t.is(index.collectAnHTTPQuotedString, collectAnHTTPQuotedString);
});

test('collectAnHTTPQuotedString("text/html;charset="shift_jis"iso-2022-jp", 18)', (t) => {
    const source = fromString('text/html;charset="shift_jis"iso-2022-jp');
    t.log(`${collectAnHTTPQuotedString(source, 18, false)}`);
    t.deepEqual(
        collectAnHTTPQuotedString(source, 18, false),
        fromString('"shift_jis"'),
    );
});

test('collectAnHTTPQuotedString("text/html;charset="shift_jis"iso-2022-jp", 18, true)', (t) => {
    const source = fromString('text/html;charset="shift_jis"iso-2022-jp');
    t.log(`${collectAnHTTPQuotedString(source, 18, true)}`);
    t.deepEqual(
        collectAnHTTPQuotedString(source, 18, true),
        fromString('shift_jis'),
    );
});

test('collectAnHTTPQuotedString("text/html;charset="shift_jis"iso-2022-jp", 17)', (t) => {
    const source = fromString('text/html;charset="shift_jis"iso-2022-jp');
    t.throws(() => collectAnHTTPQuotedString(source, 17, false));
});

test('collectAnHTTPQuotedString("text/html;charset="shift_ji", 18)', (t) => {
    const source = fromString('text/html;charset="shift_ji');
    t.deepEqual(
        collectAnHTTPQuotedString(source, 18, true),
        fromString('shift_ji'),
    );
});

test('collectAnHTTPQuotedString("fooあ"bar, 18)', (t) => {
    const source = fromString('"fooあ"bar');
    t.log(collectAnHTTPQuotedString(source, 0, true));
    t.deepEqual(
        collectAnHTTPQuotedString(source, 0, true),
        fromString('fooあ'),
    );
});

test('collectAnHTTPQuotedString("あfoo"bar, 18)', (t) => {
    const source = fromString('"あfoo"bar');
    t.log(collectAnHTTPQuotedString(source, 0, true));
    t.deepEqual(
        collectAnHTTPQuotedString(source, 0, true),
        fromString('あfoo'),
    );
});
