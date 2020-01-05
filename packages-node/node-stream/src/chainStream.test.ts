import test from 'ava';
import * as stream from 'stream';
import {readObjectStream} from './readStream';
import {chainStream} from './chainStream';

test('chainStream (source)', async (t) => {
    const source = new stream.Readable({
        read() {
            // do nothing
        },
    });
    source.push('AbC');
    source.push('D');
    setImmediate(() => {
        source.push('😇');
        source.push('e');
        source.push('F');
        source.push(null);
    });
    const chained = chainStream(
        source,
        new stream.Transform({
            transform(chunk, _encoding, callback) {
                this.push(`${chunk}-1`);
                callback();
            },
        }),
        new stream.Transform({
            transform(chunk, _encoding, callback) {
                this.push(`${chunk}-2`);
                callback();
            },
        }),
    );
    const result = await readObjectStream(chained);
    t.deepEqual(
        result.map((chunk) => `${chunk}`),
        [
            'AbC-1-2',
            'D-1-2',
            '😇-1-2',
            'e-1-2',
            'F-1-2',
        ],
    );
});

test('chainStream (tranform)', async (t) => {
    const source = new stream.PassThrough();
    source.write('AbC');
    source.write('D');
    setImmediate(() => {
        source.write('😇');
        source.write('e');
        source.end('F');
    });
    const chained = chainStream(
        new stream.Transform({
            transform(chunk, _encoding, callback) {
                this.push(`${chunk}-1`);
                callback();
            },
        }),
        new stream.Transform({
            transform(chunk, _encoding, callback) {
                this.push(`${chunk}-2`);
                callback();
            },
        }),
    );
    const result = await readObjectStream(source.pipe(chained));
    t.deepEqual(
        result.map((chunk) => `${chunk}`),
        [
            'AbC-1-2',
            'D-1-2',
            '😇-1-2',
            'e-1-2',
            'F-1-2',
        ],
    );
});
