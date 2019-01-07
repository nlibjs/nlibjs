import {join} from 'path';
import {absolutify} from '@nlib/node-util';
import {readdir, rmdir, unlink, lstat} from './core';
import {PathLike} from 'fs';

export type onFileHook = (target: string) => void;

const rmrfCore = async (target: string, onFile: onFileHook, retryCount: number = 0): Promise<boolean> => {
    try {
        const stats = await lstat(target);
        await onFile(target);
        if (stats.isDirectory()) {
            await Promise.all((await readdir(target)).map((name) => rmrfCore(join(target, name), onFile)));
            await rmdir(target);
        } else {
            await unlink(target);
        }
        return true;
    } catch (error) {
        switch (error.code) {
        case 'ENOENT':
            return false;
        default:
        }
        throw error;
    }
};

export const rmrf = (target: PathLike, onFile: onFileHook = () => {}) => rmrfCore(absolutify(target), onFile);
