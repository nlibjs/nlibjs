import test from 'ava';
import {basename} from 'path';
import {stat} from './core';
import {mktempdir} from './mktempdir';
import * as index from './index';

test('index.mktempdir', (t) => {
    t.is(index.mktempdir, mktempdir);
});

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
