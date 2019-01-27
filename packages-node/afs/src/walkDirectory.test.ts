import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdir,
    writeFile,
    symlink,
} from './core';
import {mktempdir} from './mktempdir';
import {walkDirectory, IFileInfo} from './walkDirectory';
import * as index from './index';

const test = anyTest as TestInterface<{
    directory: string,
}>;

const collectResults = async (iterator: AsyncIterator<IFileInfo>): Promise<Array<IFileInfo>> => {
    const results: Array<IFileInfo> = [];
    while (1) {
        const result = await iterator.next();
        if (result.done) {
            break;
        }
        results.push(result.value);
    }
    return results;
};

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('index.tree', (t) => {
    t.is(index.walkDirectory, walkDirectory);
});

test('return files', async (t) => {
    const dir1 = join(t.context.directory, 'foo');
    await mkdir(dir1);
    const file1 = join(dir1, 'bar');
    await writeFile(file1, file1);
    const result = await collectResults(walkDirectory(t.context.directory));
    t.is(result.length, 3);
    t.is(result[0].path, t.context.directory);
    t.true(result[0].stats.isDirectory());
    t.is(result[1].path, dir1);
    t.true(result[1].stats.isDirectory());
    t.is(result[2].path, file1);
    t.true(result[2].stats.isFile());
});

test('return files and symbolic links', async (t) => {
    const dir1 = join(t.context.directory, 'foo');
    await mkdir(dir1);
    const file1 = join(dir1, 'bar');
    await writeFile(file1, file1);
    const symlink1 = join(dir1, 'baz');
    await symlink(file1, symlink1);
    const result = await collectResults(walkDirectory(t.context.directory));
    t.is(result.length, 4);
    t.is(result[0].path, t.context.directory);
    t.true(result[0].stats.isDirectory());
    t.is(result[1].path, dir1);
    t.true(result[1].stats.isDirectory());
    t.is(result[2].path, file1);
    t.true(result[2].stats.isFile());
    t.is(result[3].path, symlink1);
    t.true(result[3].stats.isSymbolicLink());
});
