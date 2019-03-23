import test from 'ava';
import * as imported from './index';

const allowedGlobals = new Set([
    'URL',
    'URLSearchParams',
]);

Object.keys(imported)
.forEach((key) => {
    test(key, (t) => {
        t.true(
            key in global || allowedGlobals.has(key),
            `global.${key} is undefined`,
        );
    });
});
