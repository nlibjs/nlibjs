import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdtemp,
    readFile,
    stat,
    rmrf,
    mkdirp,
    updateFile,
} from '.';
const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(tmpdir());
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('write data to a file in a nested directory', async (t) => {
    const filePath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    const data = filePath;
    await updateFile(filePath, data);
    const written = await readFile(filePath, 'utf8');
    t.is(written, data);
});

test('write files in parallel', async (t) => {
    const filePaths = Array(100).fill(1).map((x, index) => {
        const directories = Array(index % 8).fill(1).map((x, index) => `dir${index}`);
        return join(t.context.directory, ...directories, `file${index}`);
    });
    await Promise.all(filePaths.map((filePath) => updateFile(filePath, filePath)));
    for (const filePath of filePaths) {
        const written = await readFile(filePath, 'utf8');
        t.is(written, filePath);
    }
});

test('throw an error if there is a directory', async (t) => {
    const dirPath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    await mkdirp(dirPath);
    await t.throwsAsync(() => updateFile(dirPath, dirPath));
});

test('do nothing if the data will be unchanged', async (t) => {
    const filePath = join(t.context.directory, 'dir1', 'dir2', 'dir3');
    const data1 = `${filePath}1`;
    await updateFile(filePath, data1);
    const {mtime: mtime1} = await stat(filePath);
    await wait(50);
    const data2 = `${filePath}2`;
    await updateFile(filePath, data2);
    const {mtime: mtime2} = await stat(filePath);
    await wait(50);
    const data3 = data2;
    await updateFile(filePath, data3);
    const {mtime: mtime3} = await stat(filePath);
    t.true(mtime1 < mtime2);
    t.is(mtime2.getTime(), mtime3.getTime());
});
