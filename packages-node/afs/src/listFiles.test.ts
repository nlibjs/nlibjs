import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import {mkdir, writeFile, symlink} from './core';
import {mktempdir} from './mktempdir';
import {listFiles} from './listFiles';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('list files', async (t) => {
    const dir = path.join(t.context.directory, 'foo');
    await mkdir(dir);
    const file1 = path.join(dir, 'bar');
    await writeFile(file1, file1);
    const symlink1 = path.join(dir, 'baz');
    await symlink(file1, symlink1);
    const result = await listFiles(t.context.directory);
    t.deepEqual(result, [file1]);
});
