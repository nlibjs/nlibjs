import * as stream from 'stream';

const createInputWrapper = (
    input: stream.Writable | stream.Readable,
): stream.Duplex => {
    if ('write' in input) {
        return new stream.Transform({
            objectMode: true,
            transform(chunk, _encoding, callback) {
                input.write(chunk);
                callback();
            },
            flush(callback) {
                if (!input.writableEnded) {
                    input.end();
                }
                callback();
            },
        });
    }
    return new stream.PassThrough({objectMode: true});
};

export const chainStream = (
    input: stream.Writable | stream.Readable,
    ...streams: Array<stream.Duplex>
): stream.Duplex => {
    const wrapper = createInputWrapper(input);
    streams.reduce((previous, next) => previous.pipe(next), input)
    .pipe(new stream.Writable({
        objectMode: true,
        write(chunk, _encoding, callback) {
            wrapper.push(chunk);
            callback();
        },
        final(callback) {
            if (!wrapper.writableEnded) {
                wrapper.end();
            }
            callback();
        },
    }));
    return wrapper;
};
