import {join, relative, dirname} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdir,
    symlink,
    lstat,
    readlink,
} from './core';
import {mktempdir} from './mktempdir';
import {writeFilep} from './writeFilep';
import {cpr} from './cpr';
import {isSameFile} from './isSameFile';
import * as index from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
});

test('index.cpr', (t) => {
    t.is(index.cpr, cpr);
});

test('copy a file in a directory', async (t) => {
    const copieePath = join(t.context.directory, 'copiee');
    await writeFilep(copieePath, copieePath);
    const copiedPath = join(t.context.directory, 'copied1', 'copied2');
    await cpr(copieePath, copiedPath);
    t.true(await isSameFile(copiedPath, copieePath));
});

test('copy a directory', async (t) => {
    const copieeDir = join(t.context.directory, 'copiee');
    await mkdir(copieeDir);
    const copiedDir = join(t.context.directory, 'copied');
    const filenames = Array(100).fill(1).map((x, index) => ({
        copiee: join(copieeDir, `dir-${index}`, `file-${index}`),
        copied: join(copiedDir, `dir-${index}`, `file-${index}`),
    }));
    await Promise.all(filenames.map(({copiee}) => writeFilep(copiee, copiee)));
    await cpr(copieeDir, copiedDir);
    await Promise.all(filenames.map(async ({copiee, copied}) => {
        t.true(await isSameFile(copied, copiee));
    }));
});

test('copy an absolute symbolic link to a file in copiee', async (t) => {
    const copieeDir = join(t.context.directory, 'copiee');
    await mkdir(copieeDir);
    const linkeePath = join(copieeDir, 'linkee1', 'linkee2');
    await writeFilep(linkeePath, linkeePath);
    const linkPath = join(copieeDir, 'linkPath');
    await symlink(linkeePath, linkPath);
    const copiedDir = join(t.context.directory, 'copied1', 'copied2');
    await cpr(copieeDir, copiedDir);
    const copiedSymlink = join(copiedDir, relative(copieeDir, linkPath));
    t.true((await lstat(copiedSymlink)).isSymbolicLink());
    const expectedSymlinkTarget = join(copiedDir, relative(copieeDir, linkeePath));
    t.is(await readlink(copiedSymlink), expectedSymlinkTarget);
    t.true(await isSameFile(copiedSymlink, linkPath));
});

test('copy an relative symbolic link to a file in copiee', async (t) => {
    const copieeDir = join(t.context.directory, 'copiee');
    await mkdir(copieeDir);
    const linkeeFile = join(copieeDir, 'linkee1', 'linkee2');
    await writeFilep(linkeeFile, linkeeFile);
    const linkPath = join(copieeDir, 'linkPath');
    await symlink(relative(dirname(linkPath), linkeeFile), linkPath);
    const copiedDir = join(t.context.directory, 'copied1', 'copied2');
    await cpr(copieeDir, copiedDir);
    const copiedSymlink = join(copiedDir, relative(copieeDir, linkPath));
    t.true((await lstat(copiedSymlink)).isSymbolicLink());
    const copiedLinkee = join(copiedDir, relative(copieeDir, linkeeFile));
    t.is(await readlink(copiedSymlink), relative(dirname(copiedSymlink), copiedLinkee));
    t.true(await isSameFile(copiedSymlink, linkPath));
});

test('copy an absolute symbolic link to a file outside copiee', async (t) => {
    const linkeeDir = join(t.context.directory, 'linkee');
    await mkdir(linkeeDir);
    const linkeeFile = join(linkeeDir, 'linkee1', 'linkee2');
    await writeFilep(linkeeFile, linkeeFile);
    const copieeDir = join(t.context.directory, 'copiee');
    await mkdir(copieeDir);
    const linkPath = join(copieeDir, 'linkPath');
    await symlink(linkeeFile, linkPath);
    const copiedDir = join(t.context.directory, 'copied1', 'copied2');
    await cpr(copieeDir, copiedDir);
    const copiedSymlink = join(copiedDir, 'linkPath');
    t.true((await lstat(copiedSymlink)).isSymbolicLink());
    t.is(await readlink(copiedSymlink), linkeeFile);
    t.true(await isSameFile(copiedSymlink, linkPath));
});

test('copy an relative symbolic link to a file outside copiee', async (t) => {
    const linkeeDir = join(t.context.directory, 'linkee');
    await mkdir(linkeeDir);
    const linkeeFile = join(linkeeDir, 'linkee1', 'linkee2');
    await writeFilep(linkeeFile, linkeeFile);
    const copieeDir = join(t.context.directory, 'copiee');
    await mkdir(copieeDir);
    const linkPath = join(copieeDir, 'linkPath');
    await symlink(relative(dirname(linkPath), linkeeFile), linkPath);
    const copiedDir = join(t.context.directory, 'copied1', 'copied2');
    await cpr(copieeDir, copiedDir);
    const copiedSymlink = join(copiedDir, relative(copieeDir, linkPath));
    t.true((await lstat(copiedSymlink)).isSymbolicLink());
    t.is(await readlink(copiedSymlink), relative(dirname(copiedSymlink), linkeeFile));
    t.true(await isSameFile(copiedSymlink, linkPath));
});
