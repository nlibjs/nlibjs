import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {mkdtemp} from './core';
import {rmrf} from './rmrf';
import {isSameFile} from './isSameFile';
import {writeFilep} from './writeFilep';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(join(tmpdir(), 'isSameFile'));
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
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
    await t.throwsAsync(() => isSameFile(pathA, pathB));
});

test('throw nothing if pathes points wrong location but buffers are given', async (t) => {
    const pathA = join(t.context.directory, 'fileA');
    const pathB = join(t.context.directory, 'fileB');
    const data = Buffer.from(`${pathA}${pathB}`);
    const result = await isSameFile(pathA, pathB, data, data);
    t.true(result);
});