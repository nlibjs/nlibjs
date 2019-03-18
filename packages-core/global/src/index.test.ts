import test from 'ava';
import * as imported from './index';

Object.keys(imported).forEach((key) => {
    test(key, (t) => {
        t.true(key in global, `global.${key} is undefined`);
    });
});
