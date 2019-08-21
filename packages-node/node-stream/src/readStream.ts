import {Writable, Stream} from 'stream';

export const readStream = async (
    readableStream: Stream,
): Promise<Buffer> => {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
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
    return buffer;
};

export const readObjectStream = async <TType>(
    readableStream: Stream,
): Promise<Array<TType>> => {
    const data = await new Promise<Array<TType>>((resolve, reject) => {
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
    return data;
};
