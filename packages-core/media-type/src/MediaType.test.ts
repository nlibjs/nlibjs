import test from 'ava';
import {toString} from '@nlib/infra';
import {MediaType} from './MediaType';

test('fromString("")', (t) => {
    t.is(MediaType.fromString(''), null);
});

test('teXt/hTmL;cHarSEt="["]"iso-2022-jp', (t) => {
    const mediaType = MediaType.fromString('teXt/hTmL;cHarSEt="[\\\\]"iso-2022-jp');
    if (mediaType) {
        t.is(toString(mediaType.type), 'text');
        t.is(toString(mediaType.subtype), 'html');
        t.is(toString(mediaType.essence), 'text/html');
        t.is(mediaType.parameters.size, 1);
        const charset = mediaType.parameters.get('charset');
        t.is(charset ? toString(charset) : '', '[\\]');
        t.is(mediaType.toString(), 'text/html;charset="[\\\\]"');
    } else {
        t.truthy(mediaType);
    }
});
