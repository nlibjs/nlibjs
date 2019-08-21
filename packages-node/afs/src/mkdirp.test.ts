import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    stat,
    writeFile,
    chmod,
} from './core';
import {mktempdir} from './mktempdir';
import {mkdirp} from './mkdirp';
import * as index from './index';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('index.mkdirp', (t) => {
    t.is(index.mkdirp, mkdirp);
});

test('create a directory', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    t.true(await mkdirp(dirPath));
    t.true((await stat(dirPath)).isDirectory());
});

test('create a directory with useNativeRecursiveOptionIfAvailable:false', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    t.true(await mkdirp(dirPath, 0o777, false));
    t.true((await stat(dirPath)).isDirectory());
});

test('do nothing if there is a directory', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    t.true(await mkdirp(dirPath, 0o777, false));
    t.false(await mkdirp(dirPath, 0o777, false));
    t.true((await stat(dirPath)).isDirectory());
});

test('throw an EEXIST error', async (t) => {
    const dirPath1 = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    t.true(await mkdirp(dirPath1));
    t.true((await stat(dirPath1)).isDirectory());
    const dirPath2 = join(dirPath1, 'dir4');
    await writeFile(dirPath2, dirPath2);
    await t.throwsAsync(async () => {
        await mkdirp(dirPath2);
    }, {code: 'EEXIST'});
});

if (process.platform !== 'win32') {
    test('throw an EACCES error', async (t) => {
        const dirPath1 = join(t.context.directory, 'dir1', 'dir2', 'dir3');
        t.true(await mkdirp(dirPath1));
        t.true((await stat(dirPath1)).isDirectory());
        await chmod(dirPath1, 1);
        const dirPath2 = join(dirPath1, 'dir4');
        await t.throwsAsync(async () => {
            await mkdirp(dirPath2);
        }, {code: 'EACCES'});
    });
}
