import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {mktempdir} from './mktempdir';
import {writeFilep} from './writeFilep';
import {isSameFile} from './isSameFile';
import * as index from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('index.isSameFile', (t) => {
    t.is(index.isSameFile, isSameFile);
});

test('return true if two paths are same', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    await writeFilep(pathA, pathA);
    const result = await isSameFile(pathA, pathA);
    t.true(result);
});

test('return true if two files have a same data', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    const pathB = join(t.context.directory, 'fileB');
    const data = `${pathA}${pathB}`;
    await writeFilep(pathA, data);
    await writeFilep(pathB, data);
    const result = await isSameFile(pathA, pathB);
    t.true(result);
});

test('return false if two files have different data', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    const pathB = join(t.context.directory, 'fileB');
    await writeFilep(pathA, pathA);
    await writeFilep(pathB, pathB);
    const result = await isSameFile(pathA, pathB);
    t.false(result);
});

test('throw an error if pathes points wrong location', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    const pathB = join(t.context.directory, 'fileB');
    await t.throwsAsync(() => isSameFile(pathA, pathB), {code: 'ENOENT'});
});

test('throw nothing if pathes points wrong location but buffers are given', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    const pathB = join(t.context.directory, 'fileB');
    const data = Buffer.from(`${pathA}${pathB}`);
    const result = await isSameFile(pathA, pathB, data, data);
    t.true(result);
});
