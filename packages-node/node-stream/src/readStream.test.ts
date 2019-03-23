import test from 'ava';
import {readStream, readObjectStream} from './readStream';
import {PassThrough} from 'stream';
import * as index from './index';

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
    }, 0);
    const read = await readStream(readableStream);
    t.is(`${read}`, `${data}${data}${data}`);
});

test('read an object stream', async (t) => {
    const readableStream = new PassThrough({objectMode: true});
    readableStream.write(100);
    setTimeout(() => {
        readableStream.write(200);
        readableStream.end(300);
    }, 0);
    const read = await readObjectStream<number>(readableStream);
    t.deepEqual(read, [100, 200, 300]);
});
