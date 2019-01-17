import {Uint8Array} from '@nlib/global';
import test from 'ava';
import {
    toLowerCase,
    toUpperCase,
    caseInsensitiveMatch,
    isomorphicDecode,
} from './4.4.ByteSequences';

test('toLowerCase', (t) => {
    t.deepEqual(
        toLowerCase(new Uint8Array([0x41, 0x42, 0x63, 0x64])),
        new Uint8Array([0x61, 0x62, 0x63, 0x64]),
    );
});

test('toUpperCase', (t) => {
    t.deepEqual(
        toUpperCase(new Uint8Array([0x41, 0x42, 0x63, 0x64])),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    );
});

test('caseInsensitiveMatch', (t) => {
    t.true(caseInsensitiveMatch(
        new Uint8Array([0x41, 0x42, 0x63, 0x64]),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    ));
    t.false(caseInsensitiveMatch(
        new Uint8Array([0x40, 0x42, 0x63, 0x64]),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    ));
});

test('isomorphicDecode', (t) => {
    t.is(isomorphicDecode(new Uint8Array([0x41, 0x42, 0x63, 0x64])), 'ABcd');
});
