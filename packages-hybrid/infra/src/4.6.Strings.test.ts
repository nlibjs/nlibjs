import test from 'ava';
import {Uint8Array} from '@nlib/global';
import {getCodePoints} from './getCodePoints';
import {
    fromString,
    isomorphicEncode,
    isASCIIString,
    toASCIILowerCase,
    toASCIIUpperCase,
    encodeASCII,
    decodeASCII,
    caseInsensitiveMatch,
    stripNewlines,
    normalizeNewlines,
    stripAndCollapseASCIIWhiteSpace,
    collectCodePointSequence,
    strictlySplit,
    splitOnASCIIWhitespace,
    concatenate,
    stripLeading,
    stripTrailing,
    stripLeadingAndTrailing,
    skip,
    skipRight,
    splitOn,
    matches,
    doesNotMatch,
    fromIterable,
    fromCodePoint,
    toScalarValueString,
    leftEqual,
    rightEqual,
} from './4.6.Strings';
import {CodePoint} from './types';
import {isASCIIWhitespace} from './4.5.CodePoints';

test('leftEqual', (t) => {
    t.true(leftEqual(
        fromString('AbC'),
        fromString('AbCd'),
    ));
    t.false(leftEqual(
        fromString('AbC'),
        fromString('abCd'),
    ));
});

test('rightEqual', (t) => {
    t.true(rightEqual(
        fromString('AbC'),
        fromString('zAbC'),
    ));
    t.false(rightEqual(
        fromString('AbC'),
        fromString('AbCz'),
    ));
});

test('toScalarValueString', (t) => {
    t.deepEqual(
        toScalarValueString('AbC'),
        fromIterable([0x41, 0x62, 0x43]),
    );
    t.deepEqual(
        toScalarValueString(fromString('AbC')),
        fromIterable([0x41, 0x62, 0x43]),
    );
});

test('fromIterable', (t) => {
    t.deepEqual(
        fromString('AbC'),
        fromIterable([0x41, 0x62, 0x43]),
    );
});

test('fromCodePoint', (t) => {
    t.deepEqual(
        fromString('AbC'),
        fromCodePoint(0x41 as CodePoint, 0x62 as CodePoint, 0x43 as CodePoint),
    );
});

test('"AbC".isomorphicEncode()', (t) => {
    t.deepEqual(
        isomorphicEncode(fromString('AbC')),
        Uint8Array.from([0x41, 0x62, 0x43]),
    );
});

test('"😇".isomorphicEncode()', (t) => {
    t.throws(() => isomorphicEncode(fromString('😇')));
});

test('"AbC".isASCIIString', (t) => {
    t.true(isASCIIString(fromString('AbC')));
});

test('"😇".isASCIIString', (t) => {
    t.false(isASCIIString(fromString('😇')));
});

test('toASCIILowerCase("AbC")', (t) => {
    t.deepEqual(toASCIILowerCase(fromString('AbC')), fromString('abc'));
});

test('toASCIIUpperCase("AbC")', (t) => {
    t.deepEqual(toASCIIUpperCase(fromString('AbC')), fromString('ABC'));
});

test('caseInsensitiveMatch("AbC", "aBc")', (t) => {
    t.true(caseInsensitiveMatch(
        fromString('AbC'),
        fromString('aBc'),
    ));
});

test('caseInsensitiveMatch("AbCd", "aBc")', (t) => {
    t.false(caseInsensitiveMatch(
        fromString('AbCd'),
        fromString('aBc'),
    ));
});

test('encodeASCII("AbC")', (t) => {
    t.deepEqual(
        encodeASCII(fromString('AbC')),
        Uint8Array.from(getCodePoints('AbC')),
    );
});

test('encodeASCII("😇")', (t) => {
    t.throws(() => encodeASCII(fromString('😇')));
});

test('decodeASCII([0x41, 0x62, 0x43])', (t) => {
    t.deepEqual(
        decodeASCII(Uint8Array.from(fromString('AbC'))),
        fromString('AbC'),
    );
});

test('decodeASCII([0x9F])', (t) => {
    t.throws(() => decodeASCII(Uint8Array.from([0x9F])));
});

test('stripNewlines("Ab\\n\\r\\r\\nC")', (t) => {
    t.deepEqual(
        stripNewlines(fromString('Ab\n\r\r\nC')),
        fromString('AbC'),
    );
});

test('normalizeNewlines("Ab\\n\\r\\r\\nC")', (t) => {
    t.deepEqual(
        normalizeNewlines(fromString('Ab\n\r\r\nC')),
        fromString('Ab\n\n\nC'),
    );
});

test('stripLeading("\\t Ab\\n\\r\\r\\nC\\t ", isASCIIWhitespace)', (t) => {
    t.deepEqual(
        stripLeading(fromString('\t Ab\n\r\r\nC\t '), isASCIIWhitespace),
        fromString('Ab\n\r\r\nC\t '),
    );
});

test('stripTrailing("\\t Ab\\n\\r\\r\\nC\\t ", isASCIIWhitespace)', (t) => {
    t.deepEqual(
        stripTrailing(fromString('\t Ab\n\r\r\nC\t '), isASCIIWhitespace),
        fromString('\t Ab\n\r\r\nC'),
    );
});

test('stripLeadingAndTrailing("\\t Ab\\n\\r\\r\\nC\\t ", isASCIIWhitespace)', (t) => {
    t.deepEqual(
        stripLeadingAndTrailing(fromString('\t Ab\n\r\r\nC\t '), isASCIIWhitespace),
        fromString('Ab\n\r\r\nC'),
    );
});

test('stripAndCollapseASCIIWhiteSpace("\\t Ab\\n\\r\\r\\nC\\t ")', (t) => {
    t.deepEqual(
        stripAndCollapseASCIIWhiteSpace(fromString('\t Ab\n\r\r\nC\t ')),
        fromString('Ab C'),
    );
});

test('collectCodePointSequence("AAAbbbCCC") (1)', (t) => {
    let position = 0;
    const collected = collectCodePointSequence(
        fromString('AAAbbbCCC'),
        position,
        (codePoint) => codePoint === 0x41,
        (newPosition) => {
            position = newPosition;
        },
    );
    t.deepEqual(collected, fromString('AAA'));
    t.is(position, 3);
});

test('collectCodePointSequence("AAAbbbCCC") (2)', (t) => {
    let position = 0;
    const collected = collectCodePointSequence(
        fromString('AAAbbbCCC'),
        position,
        (codePoint) => codePoint === 0x62,
        (newPosition) => {
            position = newPosition;
        },
    );
    t.deepEqual(collected, fromString(''));
    t.is(position, 0);
});

test('collectCodePointSequence("AAAbbbCCC") (3)', (t) => {
    let position = 3;
    const collected = collectCodePointSequence(
        fromString('AAAbbbCCC'),
        position,
        (codePoint) => codePoint === 0x62,
        (newPosition) => {
            position = newPosition;
        },
    );
    t.deepEqual(collected, fromString('bbb'));
    t.is(position, 6);
});

test('skip("AAA   CCC", 0, isASCIIWhitespace)', (t) => {
    t.is(
        skip(fromString('AAA   CCC'), 0, isASCIIWhitespace),
        0,
    );
});

test('skip("AAA   CCC", 3, isASCIIWhitespace)', (t) => {
    t.is(
        skip(fromString('AAA   CCC'), 3, isASCIIWhitespace),
        6,
    );
});

test('skip("AAA   CCC", 4, isASCIIWhitespace)', (t) => {
    t.is(
        skip(fromString('AAA   CCC'), 4, isASCIIWhitespace),
        6,
    );
});

test('skipRight("AAA   CCC", 9, isASCIIWhitespace)', (t) => {
    t.is(
        skipRight(fromString('AAA   CCC'), 9, isASCIIWhitespace),
        9,
    );
});

test('skipRight("AAA   CCC", 6, isASCIIWhitespace)', (t) => {
    t.is(
        skipRight(fromString('AAA   CCC'), 6, isASCIIWhitespace),
        3,
    );
});

test('skipRight("AAA   CCC", 5, isASCIIWhitespace)', (t) => {
    t.is(
        skipRight(fromString('AAA   CCC'), 5, isASCIIWhitespace),
        3,
    );
});

test('strictlySplit("XAAXbbXCCXX", "X")', (t) => {
    t.deepEqual(
        [...strictlySplit(fromString('XAAXbbXCCXX'), ('X').codePointAt(0) as CodePoint)],
        [
            fromString(''),
            fromString('AA'),
            fromString('bb'),
            fromString('CC'),
            fromString(''),
            fromString(''),
        ],
    );
});

test('splitOnASCIIWhitespace(" \\t\\n\\r AA \\t\\n\\r bb \\t\\n\\r CC \\t\\n\\r ")', (t) => {
    const source = ' \t\n\r AA \t\n\r bb \t\n\r CC \t\n\r ';
    t.log([...splitOnASCIIWhitespace(fromString(source))].map((x) => `${x}`));
    t.deepEqual(
        [...splitOnASCIIWhitespace(fromString(source))],
        [
            fromString('AA'),
            fromString('bb'),
            fromString('CC'),
        ],
    );
});

test('splitOn("  AA bb  ,  CC  ,DD,  ", COMMA)', (t) => {
    const COMMA = 0x002C as CodePoint;
    const source = '  AA bb  ,  CC  ,DD,  ';
    t.log([...splitOn(fromString(source), matches(COMMA))].map((x) => `${x}`));
    t.deepEqual(
        [...splitOn(fromString(source), matches(COMMA))],
        [
            fromString('AA bb'),
            fromString('CC'),
            fromString('DD'),
            fromString(''),
        ],
    );
});

test('concatenate(" AA ", " bb ", " CC ")', (t) => {
    t.deepEqual(
        concatenate(fromString(' AA '), fromString(' bb '), fromString(' CC ')),
        fromString(' AA  bb  CC '),
    );
});

test('doesNotMatch(0, 1, 2)', (t) => {
    const condition = doesNotMatch(0 as CodePoint, 1 as CodePoint);
    t.false(condition(0 as CodePoint));
    t.false(condition(1 as CodePoint));
    t.true(condition(2 as CodePoint));
});

test('toString', (t) => {
    t.is(fromString('AbC').toString(), 'AbC');
});
