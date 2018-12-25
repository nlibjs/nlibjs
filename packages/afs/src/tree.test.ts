import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mktempdir,
    rmrf,
    tree,
    mkdir,
    writeFile,
    symlink,
} from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('return a tree', async (t) => {
    const dir1 = join(t.context.directory, 'foo');
    await mkdir(dir1);
    const file1 = join(dir1, 'bar');
    await writeFile(file1, file1);
    const result = await tree(t.context.directory);
    t.is(result.type, 'directory');
    t.is(result.path, t.context.directory);
    t.truthy(result.files.foo);
    t.is(result.files.foo.type, 'directory');
    t.is(result.files.foo.path, dir1);
    t.truthy(result.files.foo.files.bar);
    t.is(result.files.foo.files.bar.type, 'file');
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
    t.is(result.type, 'directory');
    t.is(result.path, t.context.directory);
    t.truthy(result.files.foo);
    t.is(result.files.foo.type, 'directory');
    t.is(result.files.foo.path, dir1);
    t.truthy(result.files.foo.files.bar);
    t.is(result.files.foo.files.bar.type, 'file');
    t.is(result.files.foo.files.bar.path, file1);
    t.truthy(result.files.foo.files.baz);
    t.is(result.files.foo.files.baz.type, 'symboliclink');
    t.is(result.files.foo.files.baz.path, symlink1);
});
