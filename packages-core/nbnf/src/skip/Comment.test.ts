import test from 'ava';
import {fromString} from '@nlib/infra';
import {skipComment} from './Comment';

test('skipComment no match', (t) => {
    t.is(skipComment(fromString('foo;bar\nbaz'), 2), 2);
});

test('skipComment LF', (t) => {
    t.is(skipComment(fromString('foo;bar\nbaz'), 3), 8);
});

test('skipComment CR', (t) => {
    t.is(skipComment(fromString('foo;bar\rbaz'), 3), 8);
});

test('skipComment CRLF', (t) => {
    t.is(skipComment(fromString('foo;bar\r\nbaz'), 3), 9);
});
