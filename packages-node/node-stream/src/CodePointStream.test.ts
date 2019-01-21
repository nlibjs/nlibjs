import test from 'ava';
import {PassThrough} from 'stream';
import {readObjectStream} from '@nlib/node-util';
import {CodePointStream} from './CodePointStream';
import * as index from './index';

test('index.CodePointStream', (t) => {
    t.is(index.CodePointStream, CodePointStream);
});

test('AbC😇AbC', async (t) => {
    const source = new PassThrough();
    source.write('AbC');
    setImmediate(() => {
        source.write('😇');
        source.end('AbC');
    });
    t.deepEqual(
        await readObjectStream(source.pipe(new CodePointStream())),
        [0x41, 0x62, 0x43, 0x1F607, 0x41, 0x62, 0x43],
    );
});
