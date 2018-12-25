import test from 'ava';
import {basename} from 'path';
import {
    stat,
    mktempdir,
} from '.';

test('create a temporary directory', async (t) => {
    const directory = await mktempdir();
    t.true((await stat(directory)).isDirectory());
});

test('create a temporary directory with prefix', async (t) => {
    const prefix = 'foo';
    const directory = await mktempdir(prefix);
    t.true((await stat(directory)).isDirectory());
    t.true(basename(directory).startsWith(`${prefix}-`));
});
