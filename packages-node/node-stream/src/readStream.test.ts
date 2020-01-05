import test from 'ava';
import * as stream from 'stream';
import {readStream, readObjectStream} from './readStream';

test('read a stream', async (t) => {
    const readableStream = new stream.PassThrough();
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
    const readableStream = new stream.PassThrough({objectMode: true});
    readableStream.write(100);
    setTimeout(() => {
        readableStream.write(200);
        readableStream.end(300);
    }, 0);
    const read = await readObjectStream<number>(readableStream);
    t.deepEqual(read, [100, 200, 300]);
});
