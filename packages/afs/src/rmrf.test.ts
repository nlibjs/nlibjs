import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    stat,
    writeFile,
    symlink,
    mkdir,
} from './core';
import {mktempdir} from './mktempdir';
import {rmrf} from './rmrf';

const test = anyTest as TestInterface<{
    directory: string
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
    await t.throwsAsync(() => stat(filePath));
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
    await t.throwsAsync(() => stat(symlinkPath));
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
    await t.throwsAsync(() => stat(filePath));
    await t.throwsAsync(() => stat(dirPath));
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
    await t.throwsAsync(() => stat(symlinkPath));
    await t.throwsAsync(() => stat(filePath));
    await t.throwsAsync(() => stat(dirPath));
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
    const called: string[] = [];
    const result = await rmrf(dirPath, async (target) => {
        called.push(target);
        await stat(target);
    });
    t.true(result);
    await t.throwsAsync(() => stat(symlinkPath));
    await t.throwsAsync(() => stat(filePath));
    await t.throwsAsync(() => stat(dirPath));
    t.deepEqual(called, [
        dirPath,
        filePath,
        symlinkPath,
    ]);
});

test('return false if nothing is there', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const result = await rmrf(filePath);
    t.false(result);
});
