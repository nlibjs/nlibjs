import test from 'ava';
import {fromString} from '@nlib/infra';
import {skipCNL} from './CNL';

test('skipCNL no match', (t) => {
    t.is(skipCNL(fromString('foo;bar\nbaz'), 2), 2);
});

test('skipCNL comment-LF', (t) => {
    t.is(skipCNL(fromString('foo;bar\nbaz'), 3), 8);
});

test('skipCNL comment-CR', (t) => {
    t.is(skipCNL(fromString('foo;bar\rbaz'), 3), 8);
});

test('skipCNL comment-CRLF', (t) => {
    t.is(skipCNL(fromString('foo;bar\r\nbaz'), 3), 9);
});

test('skipCNL LF', (t) => {
    t.is(skipCNL(fromString('foo\nbaz'), 3), 4);
});

test('skipCNL CR', (t) => {
    t.is(skipCNL(fromString('foo\rbaz'), 3), 4);
});

test('skipCNL CRLF', (t) => {
    t.is(skipCNL(fromString('foo\r\nbaz'), 3), 5);
});
