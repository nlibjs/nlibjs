import test from 'ava';
import {PassThrough} from 'stream';
import {readObjectStream} from '@nlib/node-util';
import {fromString} from '@nlib/infra';
import {LineStream} from './LineStream';
import * as index from './index';

test('index.LineStream', (t) => {
    t.is(index.LineStream, LineStream);
});

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
