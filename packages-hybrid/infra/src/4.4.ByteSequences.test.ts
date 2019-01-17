import {Uint8Array} from '@nlib/global';
import test from 'ava';
import {
    toLowerCaseBytes,
    toUpperCaseBytes,
    caseInsensitiveMatchBytes,
    isomorphicDecode,
} from './4.4.ByteSequences';
import {getCodePoints} from './getCodePoints';

test('toLowerCase', (t) => {
    t.deepEqual(
        toLowerCaseBytes(new Uint8Array([0x41, 0x42, 0x63, 0x64])),
        new Uint8Array([0x61, 0x62, 0x63, 0x64]),
    );
});

test('toUpperCase', (t) => {
    t.deepEqual(
        toUpperCaseBytes(new Uint8Array([0x41, 0x42, 0x63, 0x64])),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    );
});

test('caseInsensitiveMatchBytes', (t) => {
    t.true(caseInsensitiveMatchBytes(
        new Uint8Array([0x41, 0x42, 0x63, 0x64]),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    ));
    t.false(caseInsensitiveMatchBytes(
        new Uint8Array([0x40, 0x42, 0x63, 0x64]),
        new Uint8Array([0x41, 0x42, 0x43, 0x44]),
    ));
});

test('isomorphicDecode', (t) => {
    t.deepEqual(isomorphicDecode(new Uint8Array([0x41, 0x42, 0x63, 0x64])), [...getCodePoints('ABcd')]);
});
