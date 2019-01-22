import test from 'ava';
import {fromString} from '@nlib/infra';
import {parse} from './parse';

test('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp', (t) => {
    const mediaType = parse(fromString('teXt/hTmL;cHarSEt="shift_jis"iso-2022-jp'));
    if (mediaType) {
        t.is(`${mediaType.type}`, 'text');
        t.is(`${mediaType.subtype}`, 'html');
        t.is(`${mediaType.essence}`, 'text/html');
        t.is(mediaType.toString(), 'text/html;charset=shift_jis');
    } else {
        t.truthy(mediaType);
    }
});

test('teXt/hTmL;cHarSEt="["]"iso-2022-jp', (t) => {
    const mediaType = parse(fromString('teXt/hTmL;cHarSEt="[\\\\]"iso-2022-jp'));
    if (mediaType) {
        t.is(`${mediaType.type}`, 'text');
        t.is(`${mediaType.subtype}`, 'html');
        t.is(`${mediaType.essence}`, 'text/html');
        t.is(`${mediaType.parameters.get('charset')}`, '[\\]');
        t.is(mediaType.toString(), 'text/html;charset="[\\\\]"');
    } else {
        t.truthy(mediaType);
    }
});
