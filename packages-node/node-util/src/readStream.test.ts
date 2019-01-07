import test from 'ava';
import {readStream} from './readStream';
import {PassThrough} from 'stream';
import * as index from '.';

test('index.readStream', (t) => {
    t.is(index.readStream, readStream);
});

test('read a stream', async (t) => {
    const readableStream = new PassThrough();
    const data = 'foo';
    readableStream.write(data);
    setTimeout(() => {
        readableStream.write(data);
        readableStream.end(data);
    });
    const read = await readStream(readableStream);
    t.is(`${read}`, `${data}${data}${data}`);
});
