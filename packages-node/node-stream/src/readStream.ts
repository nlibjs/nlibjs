import {Writable, Stream} from 'stream';

export const readStream = (readableStream: Stream): Promise<Buffer> => new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = [];
    let length = 0;
    readableStream
    .once('error', reject)
    .pipe(new Writable({
        write(chunk, _, callback) {
            chunks.push(chunk);
            length += chunk.length;
            callback();
        },
        final(callback) {
            resolve(Buffer.concat(chunks, length));
            callback();
        },
    }));
});

export const readObjectStream = <TType>(readableStream: Stream): Promise<Array<TType>> => new Promise((resolve, reject) => {
    const result: Array<TType> = [];
    readableStream
    .once('error', reject)
    .pipe(new Writable({
        objectMode: true,
        write(data: TType, _: string, callback: () => void) {
            result.push(data);
            callback();
        },
        final(callback: () => void) {
            resolve(result);
            callback();
        },
    }));
});
