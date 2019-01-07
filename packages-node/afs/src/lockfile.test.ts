import test from 'ava';
import * as _lockfile from 'lockfile';
import * as _myLockfile from './lockfile';
import * as _index from '.';

const lockfile = new Map(Object.entries(_lockfile));
const myLockfile = new Map(Object.entries(_myLockfile));
const index = new Map(Object.entries(_index));

const undocumentedFields = [
    'filetime',
];

for (const key of undocumentedFields) {
    lockfile.delete(key);
}

test('myLockfile should have all members in lockfile', (t) => {
    for (const [key, value] of lockfile) {
        t.true(myLockfile.has(key), `myLockfile.${key} is undefined but lockfile.${key} is ${typeof value}`);
        if (myLockfile.has(`${key}Sync`)) {
            t.is(typeof value, typeof myLockfile.get(key));
        } else {
            t.is(value, myLockfile.get(key) as any);
        }
    }
});

test('index should have all members in myLockfile', (t) => {
    for (const [key, value] of myLockfile) {
        t.is(value, index.get(key) as any);
    }
});
