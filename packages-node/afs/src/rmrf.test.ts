import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {stat, writeFile, symlink, mkdir, chmod} from './core';
import {mktempdir} from './mktempdir';
import {rmrf} from './rmrf';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('remove a file', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    await stat(filePath);
    const result = await rmrf(filePath);
    t.true(result);
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
});

test('remove a symlink', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    const symlinkPath = join(t.context.directory, 'symlink');
    await symlink(filePath, symlinkPath);
    await stat(symlinkPath);
    const result = await rmrf(symlinkPath);
    t.true(result);
    await t.throwsAsync(async () => {
        await stat(symlinkPath);
    }, {code: 'ENOENT'});
});

test('remove a file in a directory', async (t) => {
    const dirPath = join(t.context.directory, 'directory');
    await mkdir(dirPath);
    const filePath = join(dirPath, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    await stat(filePath);
    const result = await rmrf(dirPath);
    t.true(result);
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(dirPath);
    }, {code: 'ENOENT'});
});

test('remove a symlink in a directory', async (t) => {
    const dirPath = join(t.context.directory, 'directory');
    await mkdir(dirPath);
    const filePath = join(dirPath, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    const symlinkPath = join(dirPath, 'symlink');
    await symlink(filePath, symlinkPath);
    await stat(symlinkPath);
    const result = await rmrf(dirPath);
    t.true(result);
    await t.throwsAsync(async () => {
        await stat(symlinkPath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(dirPath);
    }, {code: 'ENOENT'});
});

test('call the onFile hook before delete a file', async (t) => {
    const dirPath = join(t.context.directory, 'directory');
    await mkdir(dirPath);
    const filePath = join(dirPath, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    const symlinkPath = join(dirPath, 'symlink');
    await symlink(filePath, symlinkPath);
    await stat(symlinkPath);
    const called: Array<string> = [];
    const result = await rmrf(dirPath, async (target) => {
        called.push(target);
        await stat(target);
    });
    t.true(result);
    await t.throwsAsync(async () => {
        await stat(symlinkPath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(dirPath);
    }, {code: 'ENOENT'});
    t.deepEqual(
        called.sort((a, b) => a.localeCompare(b)),
        [
            dirPath,
            filePath,
            symlinkPath,
        ].sort((a, b) => a.localeCompare(b)),
    );
});

test('return false if nothing is there', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const result = await rmrf(filePath);
    t.false(result);
});

if (process.platform !== 'win32') {
    test('throw an EACCES error', async (t) => {
        const dirPath = join(t.context.directory, 'directory');
        await mkdir(dirPath);
        const filePath = join(dirPath, 'file');
        await writeFile(filePath, filePath);
        await chmod(dirPath, 1);
        await t.throwsAsync(async () => {
            await rmrf(filePath);
        }, {code: 'EACCES'});
    });
}

