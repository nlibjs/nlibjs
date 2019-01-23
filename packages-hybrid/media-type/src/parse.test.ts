import test from 'ava';
import {fromString} from '@nlib/infra';
import {parse} from './parse';
import * as index from './index';

test('index does not export parse', (t) => {
    t.false('parse' in index);
});

test('return null if type is empty', (t) => {
    const mediaTypeSource = parse(fromString(''));
    t.is(mediaTypeSource, null);
});

test('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp'));
    if (mediaTypeSource) {
        t.is(`${mediaTypeSource.type}`, 'text');
        t.is(`${mediaTypeSource.subtype}`, 'html');
        t.is(mediaTypeSource.parameters.size, 1);
        t.is(`${mediaTypeSource.parameters.get('charset')}`, 'shift_jis');
    } else {
        t.truthy(mediaTypeSource);
    }
});

test('teXt/hTmL;cHarSEt="["]"iso-2022-jp', (t) => {
    const mediaTypeSource = parse(fromString('teXt/hTmL;cHarSEt="[\\\\]"iso-2022-jp'));
    if (mediaTypeSource) {
        t.is(`${mediaTypeSource.type}`, 'text');
        t.is(`${mediaTypeSource.subtype}`, 'html');
        t.is(mediaTypeSource.parameters.size, 1);
        t.is(`${mediaTypeSource.parameters.get('charset')}`, '[\\]');
    } else {
        t.truthy(mediaTypeSource);
    }
});
