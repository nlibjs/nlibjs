import * as stream from 'stream';
import * as fs from 'fs';
import {createDirectoryWalker} from './walkDirectory';

export const listFiles = async (
    directory: string,
): Promise<Array<string>> => await new Promise<Array<string>>((resolve, reject) => {
    const files: Array<string> = [];
    createDirectoryWalker(directory)
    .pipe(new stream.Writable({
        objectMode: true,
        write(chunk: {path: string, stats: fs.Stats}, _encoding, callback) {
            if (chunk.stats.isFile()) {
                files.push(chunk.path);
            }
            callback();
        },
        final(callback) {
            callback();
            resolve(files);
        },
    }))
    .once('error', reject);
});
