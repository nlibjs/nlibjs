import {tmpdir} from 'os';
import {join, sep} from 'path';
import anyTest, {TestInterface} from 'ava';
import {mkdtemp, mkdir, writeFile, readFile, symlink, lstat, readlink} from './core';
import {cpr} from './cpr';
import {rmrf} from './rmrf';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(join(tmpdir(), 'cpr'));
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('copy a file in a directory', async (t) => {
    const source = join(t.context.directory, 'source');
    const body = source;
    await writeFile(source, body);
    const dest = join(t.context.directory, 'dest');
    await cpr(source, dest);
    const copied = await readFile(dest, 'utf8');
    t.is(copied, body);
});

test('copy a directory', async (t) => {
    const sourceDir = join(t.context.directory, 'source');
    await mkdir(sourceDir);
    const destDir = join(t.context.directory, 'dest');
    const filenames = Array(100).fill(1).map((x, index) => {
        const filename = `file-${index}`;
        return {
            source: join(sourceDir, filename),
            dest: join(destDir, filename),
        };
    });
    await Promise.all(filenames.map(({source}) => writeFile(source, source)));
    await cpr(sourceDir, destDir);
    await Promise.all(filenames.map(async ({source, dest}) => {
        const [expected, actual] = await Promise.all([
            await readFile(source, 'utf8'),
            await readFile(dest, 'utf8'),
        ]);
        t.is(actual, expected);
    }));
});

test('copy an absolute symbolic link in src', async (t) => {
    const sourceDir = join(t.context.directory, 'source');
    await mkdir(sourceDir);
    const source = join(sourceDir, 'source');
    const body = source;
    await writeFile(source, body);
    const symlinked = join(sourceDir, 'symlinked');
    await symlink(source, symlinked);
    const destDir = join(t.context.directory, 'dest1', 'dest2');
    await cpr(sourceDir, destDir);
    const destSymlink = join(destDir, 'symlinked');
    const stats = await lstat(destSymlink);
    t.true(stats.isSymbolicLink());
    const target = await readlink(destSymlink);
    const dest = join(destDir, 'source');
    t.is(target, dest);
    const copied = await readFile(destSymlink, 'utf8');
    t.is(copied, body);
});

test('copy an relative symbolic link in src', async (t) => {
    const sourceDir = join(t.context.directory, 'source');
    await mkdir(sourceDir);
    const source = join(sourceDir, 'source');
    const body = source;
    await writeFile(source, body);
    const symlinked = join(sourceDir, 'symlinked');
    const relativeTarget = ['.', 'source'].join(sep);
    await symlink(relativeTarget, symlinked);
    const destDir = join(t.context.directory, 'dest1', 'dest2');
    await cpr(sourceDir, destDir);
    const destSymlink = join(destDir, 'symlinked');
    const stats = await lstat(destSymlink);
    t.true(stats.isSymbolicLink());
    const target = await readlink(destSymlink);
    t.is(target, relativeTarget);
    const copied = await readFile(destSymlink, 'utf8');
    t.is(copied, body);
});

test('copy an absolute symbolic link out src', async (t) => {
    const contentDir = join(t.context.directory, 'content');
    await mkdir(contentDir);
    const sourceDir = join(t.context.directory, 'source');
    await mkdir(sourceDir);
    const source = join(contentDir, 'source');
    const body = source;
    await writeFile(source, body);
    const symlinked = join(sourceDir, 'symlinked');
    await symlink(source, symlinked);
    const destDir = join(t.context.directory, 'dest1', 'dest2');
    await cpr(sourceDir, destDir);
    const destSymlink = join(destDir, 'symlinked');
    const stats = await lstat(destSymlink);
    t.true(stats.isSymbolicLink());
    const target = await readlink(destSymlink);
    t.is(target, source);
    const copied = await readFile(destSymlink, 'utf8');
    t.is(copied, body);
});

test('copy an relative symbolic link out src', async (t) => {
    const contentDir = join(t.context.directory, 'content');
    await mkdir(contentDir);
    const sourceDir = join(t.context.directory, 'source');
    await mkdir(sourceDir);
    const source = join(contentDir, 'source');
    const body = source;
    await writeFile(source, body);
    const symlinked = join(sourceDir, 'symlinked');
    const relativeTarget = ['..', 'content', 'source'].join(sep);
    await symlink(relativeTarget, symlinked);
    const destDir = join(t.context.directory, 'dest1', 'dest2');
    await cpr(sourceDir, destDir);
    const destSymlink = join(destDir, 'symlinked');
    const stats = await lstat(destSymlink);
    t.true(stats.isSymbolicLink());
    const target = await readlink(destSymlink);
    t.log({
        symlinked,
        relativeTarget,
        destSymlink,
        target,
    });
    t.is(target, ['..', relativeTarget].join(sep));
    const copied = await readFile(destSymlink, 'utf8');
    t.is(copied, body);
});
