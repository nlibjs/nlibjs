import test from 'ava';
import {fromString, toString} from '@nlib/infra';
import {parse} from './parse';

test('return null if type is empty', (t) => {
    const mediaTypeSource = parse(fromString(''));
    t.is(mediaTypeSource, null);
});

test('return null if subtype is empty', (t) => {
    const mediaTypeSource = parse(fromString('teXt/'));
    t.is(mediaTypeSource, null);
});

test('teXt/hTmL', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL'));
    if (mediaTypeSource) {
        t.is(toString(mediaTypeSource.type), 'text');
        t.is(toString(mediaTypeSource.subtype), 'html');
        t.is(mediaTypeSource.parameters.size, 0);
    } else {
        t.truthy(mediaTypeSource);
    }
});

test('teXt/hTmL;', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;'));
    if (mediaTypeSource) {
        t.is(toString(mediaTypeSource.type), 'text');
        t.is(toString(mediaTypeSource.subtype), 'html');
        t.is(mediaTypeSource.parameters.size, 0);
    } else {
        t.truthy(mediaTypeSource);
    }
});

test('teXt/hTmL;  cHarSEt=utf-8  ', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;  cHarSEt=utf-8  '));
    if (mediaTypeSource) {
        t.is(toString(mediaTypeSource.type), 'text');
        t.is(toString(mediaTypeSource.subtype), 'html');
        t.is(mediaTypeSource.parameters.size, 1);
        const charset = mediaTypeSource.parameters.get('charset');
        t.is(charset ? toString(charset) : '', 'utf-8');
    } else {
        t.truthy(mediaTypeSource);
    }
});

test('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp'));
    if (mediaTypeSource) {
        t.is(toString(mediaTypeSource.type), 'text');
        t.is(toString(mediaTypeSource.subtype), 'html');
        t.is(mediaTypeSource.parameters.size, 1);
        const charset = mediaTypeSource.parameters.get('charset');
        t.is(charset ? toString(charset) : '', 'shift_jis');
    } else {
        t.truthy(mediaTypeSource);
    }
});

test('teXt/hTmL;cHarSEt="["]"iso-2022-jp', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;cHarSEt="[\\\\]"iso-2022-jp'));
    if (mediaTypeSource) {
        t.is(toString(mediaTypeSource.type), 'text');
        t.is(toString(mediaTypeSource.subtype), 'html');
        t.is(mediaTypeSource.parameters.size, 1);
        const charset = mediaTypeSource.parameters.get('charset');
        t.is(charset ? toString(charset) : '', '[\\]');
    } else {
        t.truthy(mediaTypeSource);
    }
});
