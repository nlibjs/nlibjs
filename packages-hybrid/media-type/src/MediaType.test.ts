import test from 'ava';
import {MediaType} from './MediaType';
import * as index from './index';

test('index.MediaType', (t) => {
    t.is(index.MediaType, MediaType);
});

test('fromString("")', (t) => {
    t.is(MediaType.fromString(''), null);
});

test('teXt/hTmL;cHarSEt="["]"iso-2022-jp', (t) => {
    const mediaType = MediaType.fromString('teXt/hTmL;cHarSEt="[\\\\]"iso-2022-jp');
    if (mediaType) {
        t.is(`${mediaType.type}`, 'text');
        t.is(`${mediaType.subtype}`, 'html');
        t.is(`${mediaType.essence}`, 'text/html');
        t.is(mediaType.parameters.size, 1);
        t.is(`${mediaType.parameters.get('charset')}`, '[\\]');
        t.is(`${mediaType}`, 'text/html;charset="[\\\\]"');
    } else {
        t.truthy(mediaType);
    }
});
