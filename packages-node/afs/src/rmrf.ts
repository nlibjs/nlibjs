import {join} from 'path';
import {readdir, rmdir, unlink, lstat} from './core';
import {PathLike} from 'fs';
import {absolutify} from './absolutify';

export type onFileHook = (target: string) => void | Promise<void>;

const rmrfCore = async (
    target: string,
    onFile: onFileHook,
): Promise<boolean> => {
    try {
        const stats = await lstat(target);
        await onFile(target);
        if (stats.isDirectory()) {
            const files = await readdir(target);
            await Promise.all(files.map(async (name) => {
                await rmrfCore(join(target, name), onFile);
            }));
            await rmdir(target);
        } else {
            await unlink(target);
        }
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};

export const rmrf = async (
    target: PathLike,
    onFile: onFileHook = () => {},
): Promise<boolean> => {
    const result = await rmrfCore(absolutify(target), onFile);
    return result;
};
