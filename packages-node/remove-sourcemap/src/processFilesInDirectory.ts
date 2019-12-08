import * as stream from 'stream';
import * as afs from '@nlib/afs';
import {IProcessorList} from './types';
import {processFile} from './processFile';

export const processFilesInDirectory = async (
    directory: string,
    processorList: IProcessorList,
) => {
    const results: {[key: string]: string | null} = {};
    const tasks: Array<Promise<void>> = [];
    await new Promise((resolve, reject) => {
        afs.createDirectoryWalker(directory).pipe(new stream.Writable({
            objectMode: true,
            write({path: filePath, stats}, _encoding, callback) {
                if (stats.isFile()) {
                    const promise = processFile(filePath, processorList)
                    .then((result) => {
                        results[filePath] = result;
                    });
                    tasks.push(promise);
                }
                callback();
            },
            final(callback) {
                callback();
                resolve(results);
            },
        }))
        .once('error', reject);
    });
    await Promise.all(tasks);
    return results;
};
