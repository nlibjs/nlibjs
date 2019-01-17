import {String} from '@nlib/global';
import test from 'ava';
import {getCodePoints} from './getCodePoints';

test('getCodePoints("AbC")', (t) => {
    t.deepEqual([...getCodePoints('AbC')], [0x41, 0x62, 0x43]);
});

test('getCodePoints("😇")', (t) => {
    t.deepEqual([...getCodePoints('😇')], [0x1F607]);
});

test('getCodePoints(String.fromCharCode(0xD83D, 0xD83D, 0xDE07))', (t) => {
    t.deepEqual([...getCodePoints(String.fromCharCode(0xD83D, 0xD83D, 0xDE07))], [0xD83D, 0x1F607]);
});

test('getCodePoints(String.fromCharCode(0xD83D, 0xDE07, 0xDE07))', (t) => {
    t.deepEqual([...getCodePoints(String.fromCharCode(0xD83D, 0xDE07, 0xDE07))], [0x1F607, 0xDE07]);
});
