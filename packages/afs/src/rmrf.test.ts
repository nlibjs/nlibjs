import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdtemp,
    stat,
    writeFile,
    symlink,
    mkdir,
} from './core';
import {rmrf} from './rmrf';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(join(tmpdir(), 'cpr'));
});

test('remove a file', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    await stat(filePath);
    await rmrf(filePath);
    await t.throwsAsync(() => stat(filePath));
});

test('remove a symlink', async (t) => {
    const filePath = join(t.context.directory, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    const symlinkPath = join(t.context.directory, 'symlink');
    await symlink(filePath, symlinkPath);
    await stat(symlinkPath);
    await rmrf(symlinkPath);
    await t.throwsAsync(() => stat(symlinkPath));
});

test('remove a file in a directory', async (t) => {
    const dirPath = join(t.context.directory, 'directory');
    await mkdir(dirPath);
    const filePath = join(dirPath, 'file');
    const data = filePath;
    await writeFile(filePath, data);
    await stat(filePath);
    await rmrf(dirPath);
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
    await rmrf(dirPath);
    await t.throwsAsync(() => stat(symlinkPath));
    await t.throwsAsync(() => stat(filePath));
    await t.throwsAsync(() => stat(dirPath));
});
