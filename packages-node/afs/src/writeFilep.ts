import {dirname} from 'path';
import {writeFile} from './core';
import {mkdirp} from './mkdirp';
import {isENOENT} from './isError';

type WriteFileParams = Parameters<typeof writeFile>;
type WriteFilepParams = [string, WriteFileParams[1], WriteFileParams[2]?];

export const writeFilep = async (...args: WriteFilepParams): ReturnType<typeof writeFile> => {
    try {
        await writeFile(...args);
    } catch (error) {
        if (isENOENT(error)) {
            const [filepath] = args;
            await mkdirp(dirname(filepath));
            await writeFile(...args);
            return;
        }
        throw error;
    }
};
