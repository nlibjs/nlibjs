import test from 'ava';
import {PassThrough} from 'stream';
import {fromString} from '@nlib/infra';
import {readObjectStream} from './readStream';
import {LineStream} from './LineStream';

test('LineStream', async (t) => {
    const source = new PassThrough();
    source.write('AbC');
    source.write('\n\r');
    setImmediate(() => {
        source.write('😇');
        source.write('\n');
        source.end('AbC\r\nFoo\n ');
    });
    const result = await readObjectStream(source.pipe(new LineStream()));
    t.deepEqual(
        result,
        [
            fromString('AbC'),
            fromString(''),
            fromString('😇'),
            fromString('AbC'),
            fromString('Foo'),
            fromString(' '),
        ],
    );
});
