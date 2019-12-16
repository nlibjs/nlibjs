import test from 'ava';
import {isByte, Byte, ASCIIByte, isASCIIByte} from './4.3.Bytes';

test(`Byte: ${Byte}`, (t) => {
    t.false(isByte(-1));
    t.true(isByte(0));
    t.false(isByte(0.1));
    t.true(isByte(0x7F));
    t.true(isByte(0x7F + 1));
    t.true(isByte(255));
    t.false(isByte(256));
});

test(`ASCIIByte: ${ASCIIByte}`, (t) => {
    t.false(isASCIIByte(-1));
    t.true(isASCIIByte(0));
    t.false(isASCIIByte(0.1));
    t.true(isASCIIByte(0x7F));
    t.false(isASCIIByte(0x7F + 1));
    t.false(isASCIIByte(255));
    t.false(isASCIIByte(256));
});
