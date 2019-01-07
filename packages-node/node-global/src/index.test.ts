import anyTest, {TestInterface} from 'ava';
import {Set} from '@nlib/global';
import {httpGet, readStream} from '@nlib/node-util';
import * as imported from './index';

const test = anyTest as TestInterface<{
    declaredKeys: Set<string>
}>;

test.before(async (t) => {
    t.context.declaredKeys = new Set(Object.getOwnPropertyNames(global));
    const res = await httpGet('https://raw.githubusercontent.com/nodejs/node/master/doc/api/globals.md');
    const readme = readStream(res);
    for (const line of `${readme}`.split(/\n/)) {
        const match = line.match(/^##(?:.*:)?\s*(.*)$/);
        if (match) {
            const [key] = match[1]
            .replace(/\\(.)/g, '$1')
            .split(/\W/);
            t.context.declaredKeys.add(key);
        }
    }
    const toBeIgnored = new Set([
        'GLOBAL',
        'root',
        'queueMicrotask',
        'TextDecoder',
        'TextEncoder',
    ]);
    for (const key of t.context.declaredKeys) {
        if (key.startsWith('DTRACE') || key.startsWith('__') || toBeIgnored.has(key)) {
            t.context.declaredKeys.delete(key);
        }
    }
});

test('should have all declared keys', (t) => {
    for (const key of t.context.declaredKeys) {
        t.true(key in imported, `${key} is not exported`);
    }
});
