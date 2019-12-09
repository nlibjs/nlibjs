import * as stream from 'stream';
import * as afs from '@nlib/afs';
import {IProcessorList} from './types';
import {processFile} from './processFile';

export const processFilesInDirectory = async (
    directory: string,
    processorList: IProcessorList,
) => {
    const results: {[key: string]: string | null} = {};
    await new Promise((resolve, reject) => {
        afs.createDirectoryWalker(directory).pipe(new stream.Writable({
            objectMode: true,
            write({path: filePath, stats}, _encoding, callback) {
                if (stats.isFile()) {
                    processFile(filePath, processorList)
                    .then((result) => {
                        results[filePath] = result;
                        callback();
                    })
                    .catch(callback);
                } else {
                    callback();
                }
            },
            final(callback) {
                callback();
                resolve(results);
            },
        }))
        .once('error', reject);
    });
    return results;
};
