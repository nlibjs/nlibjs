import {normalize, join} from 'path';
import test from 'ava';
import {absolutify} from './absolutify';
import * as index from './index';

test('index.absolutify', (t) => {
    t.is(index.absolutify, absolutify);
});

test('keep an absolute path unchanged', (t) => {
    t.is(absolutify('/foo/bar'), normalize('/foo/bar'));
});

test('prefix cwd', (t) => {
    t.is(absolutify('../foo/bar'), join(process.cwd(), '../foo/bar'));
});

test('ignore the given baseDirectory', (t) => {
    t.is(absolutify('/foo/bar', '/a/b/c'), normalize('/foo/bar'));
});

test('use the given baseDirectory', (t) => {
    t.is(absolutify('../foo/bar', '/a/b/c'), normalize('/a/b/foo/bar'));
});
