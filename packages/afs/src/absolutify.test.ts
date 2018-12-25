import {normalize, join} from 'path';
import test from 'ava';
import {absolutify} from '.';

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
