import {Writable, Stream} from 'stream';

export const readStream = (readableStream: Stream): Promise<Buffer> => new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let length = 0;
    readableStream
    .once('error', reject)
    .pipe(new Writable({
        write(chunk, encoding, callback) {
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
