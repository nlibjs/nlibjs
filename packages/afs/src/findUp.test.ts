import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdtemp,
    writeFile,
    rmrf,
    mkdir,
    findUp,
} from '.';

const test = anyTest as TestInterface<{
    directory: string
    filename0: string
    filename1: string
    filename2: string
    filename3: string
    dir1: string
    file10: string
    file11: string
    dir2: string
    file20: string
    file22: string
    dir3: string
    file30: string
    file33: string
}>;

test.beforeEach(async (t) => {
    const directory = t.context.directory = await mkdtemp(join(tmpdir(), 'cpr'));
    const filename0 = t.context.filename0 = 'file0';
    const filename1 = t.context.filename1 = 'file1';
    const filename2 = t.context.filename2 = 'file2';
    const filename3 = t.context.filename3 = 'file3';
    const dir1 = t.context.dir1 = join(directory, 'dir1');
    await mkdir(dir1);
    const file10 = t.context.file10 = join(directory, filename0);
    await writeFile(file10, file10);
    const file11 = t.context.file11 = join(directory, filename1);
    await writeFile(file11, file11);
    const dir2 = t.context.dir2 = join(dir1, 'dir2');
    await mkdir(dir2);
    const file20 = t.context.file20 = join(dir2, filename0);
    await writeFile(file20, file20);
    const file22 = t.context.file22 = join(dir2, filename2);
    await writeFile(file22, file22);
    const dir3 = t.context.dir3 = join(dir2, 'dir3');
    await mkdir(dir3);
    const file30 = t.context.file30 = join(dir3, filename0);
    await writeFile(file30, file30);
    const file33 = t.context.file33 = join(dir3, filename3);
    await writeFile(file33, file33);
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('find a file in the same directory', async (t) => {
    const found = await findUp([t.context.filename0], t.context.dir3);
    t.is(found, t.context.file30);
});

test('find a file in the parent directory', async (t) => {
    const found = await findUp([t.context.filename1], t.context.dir3);
    t.is(found, t.context.file11);
});

test('find a file in the nearest parent directory', async (t) => {
    const found = await findUp([t.context.filename1, t.context.filename2], t.context.dir3);
    t.is(found, t.context.file22);
});
