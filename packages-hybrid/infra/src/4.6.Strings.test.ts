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
    stripLeadingAndTrailingASCIIWhitespace,
    stripAndCollapseASCIIWhiteSpace,
    collectCodePointSequence,
    skipASCIIWhitespace,
} from './4.6.Strings';

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

test('stripLeadingAndTrailingASCIIWhitespace("\\t Ab\\n\\r\\r\\nC\\t ")', (t) => {
    t.deepEqual(
        stripLeadingAndTrailingASCIIWhitespace(fromString('\t Ab\n\r\r\nC\t ')),
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
    t.deepEqual(
        collectCodePointSequence(fromString('AAAbbbCCC'), 0, (codePoint) => codePoint === 0x41),
        [fromString('AAA'), 3],
    );
});

test('collectCodePointSequence("AAAbbbCCC") (2)', (t) => {
    t.deepEqual(
        collectCodePointSequence(fromString('AAAbbbCCC'), 0, (codePoint) => codePoint === 0x62),
        [fromString(''), 0],
    );
});

test('collectCodePointSequence("AAAbbbCCC") (3)', (t) => {
    t.deepEqual(
        collectCodePointSequence(fromString('AAAbbbCCC'), 3, (codePoint) => codePoint === 0x62),
        [fromString('bbb'), 6],
    );
});

test('skipASCIIWhitespace("AAA   CCC", 0)', (t) => {
    t.is(
        skipASCIIWhitespace(fromString('AAA   CCC'), 0),
        0,
    );
});

test('skipASCIIWhitespace("AAA   CCC", 3)', (t) => {
    t.is(
        skipASCIIWhitespace(fromString('AAA   CCC'), 3),
        6,
    );
});

test('skipASCIIWhitespace("AAA   CCC", 4)', (t) => {
    t.is(
        skipASCIIWhitespace(fromString('AAA   CCC'), 4),
        6,
    );
});

test('toString', (t) => {
    t.is(fromString('AbC').toString(), 'AbC');
});
