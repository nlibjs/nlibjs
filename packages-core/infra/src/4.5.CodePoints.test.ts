import test from 'ava';
import {
    Surrogate,
    isSurrogate,
    ScalarValue,
    isScalarValue,
    Noncharacter,
    isNoncharacter,
} from './4.5.CodePoints';
import * as index from './index';

test(`Surrogate: ${Surrogate}`, (t) => {
    t.is(index.Surrogate, Surrogate);
    t.is(index.isSurrogate, isSurrogate);
    t.false(isSurrogate(0xD800 - 1));
    t.true(isSurrogate(0xD800));
    t.true(isSurrogate(0xDFFF));
    t.false(isSurrogate(0xDFFF + 1));
});

test(`ScalarValue: ${ScalarValue}`, (t) => {
    t.is(index.ScalarValue, ScalarValue);
    t.is(index.isScalarValue, isScalarValue);
    t.true(isScalarValue(0xD800 - 1));
    t.false(isScalarValue(0xD800));
    t.false(isScalarValue(0xDFFF));
    t.true(isScalarValue(0xDFFF + 1));
});

test(`Noncharacter: ${Noncharacter}`, (t) => {
    t.is(index.Noncharacter, Noncharacter);
    t.is(index.isNoncharacter, isNoncharacter);
    t.true(isNoncharacter(0xFDEF));
    t.true(isNoncharacter(0xFFFE));
    t.true(isNoncharacter(0xFFFF));
    t.true(isNoncharacter(0x1FFFE));
    t.true(isNoncharacter(0x1FFFF));
    t.true(isNoncharacter(0x2FFFE));
    t.true(isNoncharacter(0x2FFFF));
    t.true(isNoncharacter(0x3FFFE));
    t.true(isNoncharacter(0x3FFFF));
    t.true(isNoncharacter(0x4FFFE));
    t.true(isNoncharacter(0x4FFFF));
    t.true(isNoncharacter(0x5FFFE));
    t.true(isNoncharacter(0x5FFFF));
    t.true(isNoncharacter(0x6FFFE));
    t.true(isNoncharacter(0x6FFFF));
    t.true(isNoncharacter(0x7FFFE));
    t.true(isNoncharacter(0x7FFFF));
    t.true(isNoncharacter(0x8FFFE));
    t.true(isNoncharacter(0x8FFFF));
    t.true(isNoncharacter(0x9FFFE));
    t.true(isNoncharacter(0x9FFFF));
    t.true(isNoncharacter(0xAFFFE));
    t.true(isNoncharacter(0xAFFFF));
    t.true(isNoncharacter(0xBFFFE));
    t.true(isNoncharacter(0xBFFFF));
    t.true(isNoncharacter(0xCFFFE));
    t.true(isNoncharacter(0xCFFFF));
    t.true(isNoncharacter(0xDFFFE));
    t.true(isNoncharacter(0xDFFFF));
    t.true(isNoncharacter(0xEFFFE));
    t.true(isNoncharacter(0xEFFFF));
    t.true(isNoncharacter(0xFFFFE));
    t.true(isNoncharacter(0xFFFFF));
    t.true(isNoncharacter(0x10FFFE));
    t.true(isNoncharacter(0x10FFFF));
});
