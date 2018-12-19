import {PathLike} from 'fs';
import {dirname} from 'path';
import {mkdir, stat} from './core';

export const mkdirp = async (directory: PathLike): ReturnType<typeof mkdir> => {
    try {
        await mkdir(directory);
    } catch (error) {
        if (error.code === 'EEXIST') {
            const stats = await stat(directory);
            if (stats.isDirectory()) {
                return;
            }
        } else if (error.code === 'ENOENT') {
            await mkdirp(dirname(`${directory}`));
            await mkdirp(directory);
            return;
        }
        throw error;
    }
};
