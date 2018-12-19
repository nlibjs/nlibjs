import {join} from 'path';
import {readdir, rmdir, unlink, lstat} from './core';
import {absolutify} from './absolutify';
import {PathLike} from 'fs';

export type onFileHandler = (target: string) => any;

const rmrfCore = async (target: string, onFile?: onFileHandler) => {
    try {
        const stats = await lstat(target);
        if (onFile) {
            await onFile(target);
        }
        if (stats.isDirectory()) {
            await Promise.all((await readdir(target)).map((name) => rmrfCore(join(target, name), onFile)));
            await rmdir(target);
        } else {
            await unlink(target);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
    return true;
};

export const rmrf = (target: PathLike, onFile?: onFileHandler) => rmrfCore(absolutify(target), onFile);
