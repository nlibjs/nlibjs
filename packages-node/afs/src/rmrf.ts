import {join} from 'path';
import {PathLike} from 'fs';
import {absolutify} from '@nlib/node-util';
import {readdir, rmdir, unlink, lstat} from './core';
import {isENOENT} from './isError';

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
        if (isENOENT(error)) {
            return false;
        }
        throw error;
    }
};

const noop = () => {
    // Noop
};

export const rmrf = async (
    target: PathLike,
    onFile: onFileHook = noop,
): Promise<boolean> => {
    const result = await rmrfCore(absolutify(target), onFile);
    return result;
};
