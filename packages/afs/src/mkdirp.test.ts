import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdtemp,
    stat,
    writeFile,
    rmrf,
    mkdirp,
} from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(tmpdir());
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('create a directory', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    await mkdirp(dirPath);
    t.true((await stat(dirPath)).isDirectory());
});

test('throw an error if there is a file', async (t) => {
    const dirPath1 = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    await mkdirp(dirPath1);
    t.true((await stat(dirPath1)).isDirectory());
    const dirPath2 = join(dirPath1, 'dir4');
    await writeFile(dirPath2, dirPath2);
    await t.throwsAsync(() => mkdirp(dirPath2));
});
