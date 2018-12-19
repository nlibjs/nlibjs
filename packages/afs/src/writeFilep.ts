import {dirname} from 'path';
import {writeFile} from './core';
import {mkdirp} from './mkdirp';

export const writeFilep = async (...args: Parameters<typeof writeFile>): ReturnType<typeof writeFile> => {
    try {
        await writeFile(...args);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const [pathLike] = args;
            if (typeof pathLike !== 'number') {
                await mkdirp(dirname(`${pathLike}`));
                await writeFile(...args);
            }
        } else {
            throw error;
        }
    }
};
