import test from 'ava';
import * as _fs from 'fs';
import * as _core from './core';
import * as _index from './index';

const fs = new Map(Object.entries(_fs));
const core = new Map(Object.entries(_core));
const index = new Map(Object.entries(_index));

const ignoredFields = [
    'promises',
    'FileReadStream',
    'FileWriteStream',
    '_toUnixTimestamp',
    'F_OK',
    'R_OK',
    'W_OK',
    'X_OK',
];

for (const key of ignoredFields) {
    fs.delete(key);
}

test('core should have all members in fs', (t) => {
    for (const [key, value] of fs) {
        t.true(core.has(key), `core.${key} is undefined but fs.${key} is ${typeof value}`);
        if (core.has(`${key}Sync`)) {
            t.is(typeof value, typeof core.get(key));
        } else {
            t.true(value === core.get(key));
        }
    }
});

test('index should have all members in core', (t) => {
    for (const [key, value] of core) {
        t.true(value === index.get(key));
    }
});
