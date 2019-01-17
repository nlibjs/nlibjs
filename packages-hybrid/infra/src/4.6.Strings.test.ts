import test from 'ava';
import {Uint8Array} from '@nlib/global';
import {getCodePoints} from './getCodePoints';
import {
    isomorphicEncode,
    isASCIIString,
    toASCIILowerCase,
    toASCIIUpperCase,
    caseInsensitiveMatch,
    encodeASCII,
    decodeASCII,
    stripNewlines,
    normalizeNewlines,
    stripLeadingAndTrailingASCIIWhitespace,
    stripAndCollapseASCIIWhiteSpace,
    collectCodePointSequence,
} from './4.6.Strings';
import {ScalarValueString} from './types';

const svs = (source: string): ScalarValueString => [...getCodePoints(source)];

test('isomorphicEncode("AbC")', (t) => {
    t.deepEqual(isomorphicEncode(svs('AbC')), Uint8Array.from([0x41, 0x62, 0x43]));
});

test('isomorphicEncode("😇")', (t) => {
    t.throws(() => isomorphicEncode(svs('😇')));
});

test('isASCIIString("AbC")', (t) => {
    t.true(isASCIIString(svs('AbC')));
});

test('isASCIIString("😇")', (t) => {
    t.false(isASCIIString(svs('😇')));
});

test('toASCIILowerCase("AbC")', (t) => {
    t.deepEqual(toASCIILowerCase(svs('AbC')), [0x61, 0x62, 0x63]);
});

test('toASCIIUpperCase("AbC")', (t) => {
    t.deepEqual(toASCIIUpperCase(svs('AbC')), [0x41, 0x42, 0x43]);
});

test('caseInsensitiveMatch("AbC", "aBc")', (t) => {
    t.true(caseInsensitiveMatch(
        svs('AbC'),
        svs('aBc'),
    ));
});

test('caseInsensitiveMatch("AbCd", "aBc")', (t) => {
    t.false(caseInsensitiveMatch(
        svs('AbCd'),
        svs('aBc'),
    ));
});

test('encodeASCII("AbC")', (t) => {
    t.deepEqual(
        encodeASCII(svs('AbC')),
        Uint8Array.from(getCodePoints('AbC')),
    );
});

test('encodeASCII("😇")', (t) => {
    t.throws(() => encodeASCII(svs('😇')));
});

test('decodeASCII([0x41, 0x62, 0x43])', (t) => {
    t.deepEqual(
        decodeASCII(Uint8Array.from(svs('AbC'))),
        svs('AbC'),
    );
});

test('decodeASCII([0x9F])', (t) => {
    t.throws(() => decodeASCII(Uint8Array.from([0x9F])));
});

test('stripNewlines("Ab\\n\\r\\r\\nC")', (t) => {
    t.deepEqual(
        stripNewlines(svs('Ab\n\r\r\nC')),
        svs('AbC'),
    );
});

test('normalizeNewlines("Ab\\n\\r\\r\\nC")', (t) => {
    t.deepEqual(
        normalizeNewlines(svs('Ab\n\r\r\nC')),
        svs('Ab\n\n\nC'),
    );
});

test('stripLeadingAndTrailingASCIIWhitespace("\\t Ab\\n\\r\\r\\nC\\t ")', (t) => {
    t.deepEqual(
        stripLeadingAndTrailingASCIIWhitespace(svs('\t Ab\n\r\r\nC\t ')),
        svs('Ab\n\r\r\nC'),
    );
});

test('stripAndCollapseASCIIWhiteSpace("\\t Ab\\n\\r\\r\\nC\\t ")', (t) => {
    t.deepEqual(
        stripAndCollapseASCIIWhiteSpace(svs('\t Ab\n\r\r\nC\t ')),
        svs('Ab C'),
    );
});

test('collectCodePointSequence("AAAbbbCCC") (1)', (t) => {
    t.deepEqual(
        collectCodePointSequence(svs('AAAbbbCCC'), 0, (codePoint) => codePoint === 0x41),
        [svs('AAA'), 3],
    );
});

test('collectCodePointSequence("AAAbbbCCC") (2)', (t) => {
    t.deepEqual(
        collectCodePointSequence(svs('AAAbbbCCC'), 0, (codePoint) => codePoint === 0x62),
        [svs(''), 0],
    );
});

test('collectCodePointSequence("AAAbbbCCC") (3)', (t) => {
    t.deepEqual(
        collectCodePointSequence(svs('AAAbbbCCC'), 3, (codePoint) => codePoint === 0x62),
        [svs('bbb'), 6],
    );
});
