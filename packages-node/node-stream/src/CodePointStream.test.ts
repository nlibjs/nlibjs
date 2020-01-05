import test from 'ava';
import * as stream from 'stream';
import {readObjectStream} from './readStream';
import {CodePointStream} from './CodePointStream';

test('AbC😇AbC', async (t) => {
    const source = new stream.PassThrough();
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
