import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {mkdir, writeFile, symlink} from './core';
import {mktempdir} from './mktempdir';
import {tree} from './tree';
import {exec} from 'child_process';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('return a tree', async (t) => {
    const dir1 = join(t.context.directory, 'foo');
    await mkdir(dir1);
    const file1 = join(dir1, 'bar');
    await writeFile(file1, file1);
    const result = await tree(t.context.directory);
    t.true(result.stats.isDirectory());
    t.is(result.path, t.context.directory);
    t.truthy(result.files.foo);
    t.true(result.files.foo.stats.isDirectory());
    t.is(result.files.foo.path, dir1);
    t.truthy(result.files.foo.files.bar);
    t.true(result.files.foo.files.bar.stats.isFile());
    t.is(result.files.foo.files.bar.path, file1);
});

test('return a tree with symbolic link', async (t) => {
    const dir1 = join(t.context.directory, 'foo');
    await mkdir(dir1);
    const file1 = join(dir1, 'bar');
    await writeFile(file1, file1);
    const symlink1 = join(dir1, 'baz');
    await symlink(file1, symlink1);
    const result = await tree(t.context.directory);
    t.true(result.stats.isDirectory());
    t.is(result.path, t.context.directory);
    t.truthy(result.files.foo);
    t.true(result.files.foo.stats.isDirectory());
    t.is(result.files.foo.path, dir1);
    t.truthy(result.files.foo.files.bar);
    t.true(result.files.foo.files.bar.stats.isFile());
    t.is(result.files.foo.files.bar.path, file1);
    t.truthy(result.files.foo.files.baz);
    t.true(result.files.foo.files.baz.stats.isSymbolicLink());
    t.is(result.files.foo.files.baz.path, symlink1);
});

test('return a tree with fifo', async (t) => {
    const dir = join(t.context.directory, 'foo');
    await mkdir(dir);
    const fifoPath = join(dir, 'fifo');
    await new Promise((resolve, reject) => {
        exec(`mkfifo ${fifoPath}`, (error, stdout, stdin) => {
            if (error) {
                reject(error);
            } else {
                resolve({stdin, stdout});
            }
        });
    });
    const result = await tree(t.context.directory);
    t.true(result.stats.isDirectory());
    t.is(result.path, t.context.directory);
    t.truthy(result.files.foo);
    t.true(result.files.foo.stats.isDirectory());
    t.is(result.files.foo.path, dir);
    if (result.files.foo.files.fifo) {
        t.true(result.files.foo.files.fifo.stats.isFIFO());
        t.is(result.files.foo.files.fifo.path, fifoPath);
    }
});
