import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {readFile} from './core';
import {mktempdir} from './mktempdir';
import {writeFilep} from './writeFilep';
import {mkdirp} from './mkdirp';
import * as index from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('index.writeFilep', (t) => {
    t.is(index.writeFilep, writeFilep);
});

test('write data to a file in a nested directory', async (t) => {
    const filePath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    const data = filePath;
    await writeFilep(filePath, data);
    const written = await readFile(filePath, 'utf8');
    t.is(written, data);
});

test('write files in parallel', async (t) => {
    const filePaths = Array(100).fill(1).map((x, index) => {
        const directories = Array(index % 8).fill(1).map((x, index) => `dir${index}`);
        return join(t.context.directory, ...directories, `file${index}`);
    });
    await Promise.all(filePaths.map((filePath) => writeFilep(filePath, filePath)));
    for (const filePath of filePaths) {
        const written = await readFile(filePath, 'utf8');
        t.is(written, filePath);
    }
});

test('throw an error if there is a directory', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    await mkdirp(dirPath);
    await t.throwsAsync(() => writeFilep(dirPath, dirPath), {code: 'EISDIR'});
});
