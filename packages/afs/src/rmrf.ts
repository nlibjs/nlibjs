import {join} from 'path';
import {readdir, rmdir, unlink, lstat} from './core';
import {absolutify} from './absolutify';
import {PathLike} from 'fs';

export type onFileHook = (target: string) => void;

const rmrfCore = async (target: string, onFile?: onFileHook) => {
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

export const rmrf = (target: PathLike, onFile?: onFileHook) => rmrfCore(absolutify(target), onFile);
