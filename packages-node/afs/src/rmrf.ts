import {join} from 'path';
import {readdir, rmdir, unlink, lstat} from './core';
import {PathLike} from 'fs';
import {absolutify} from './absolutify';

export type onFileHook = (target: string) => void;

const rmrfCore = async (
    target: string,
    onFile: onFileHook,
): Promise<boolean> => {
    try {
        const stats = await lstat(target);
        await onFile(target);
        if (stats.isDirectory()) {
            const files = await readdir(target);
            await Promise.all(files.map((name) => rmrfCore(join(target, name), onFile)));
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

export const rmrf = (
    target: PathLike,
    onFile: onFileHook = () => {},
): Promise<boolean> => rmrfCore(absolutify(target), onFile);
