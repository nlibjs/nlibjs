import test from 'ava';
import * as imported from './index';

for (const key of Object.keys(imported)) {
    test(key, (t) => {
        t.true(key in global, `global.${key} is undefined`);
    });
}
