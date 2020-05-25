import {PathLike} from 'fs';
import {dirname} from 'path';
import {mkdir, stat} from './core';
import {gt} from 'semver';
import {isENOENT, isEEXIST} from './isError';
const recursiveIsSupported = gt(process.version, 'v10.12.0');

export const mkdirp = async (
    directory: PathLike,
    mode = 0o777,
    useNativeRecursiveOptionIfAvailable = true,
): Promise<boolean> => {
    try {
        const useRecursive = recursiveIsSupported && useNativeRecursiveOptionIfAvailable;
        await mkdir(directory, useRecursive ? {recursive: true, mode} : mode);
        return true;
    } catch (error) {
        if (isENOENT(error)) {
            await mkdirp(dirname(`${directory}`), mode, useNativeRecursiveOptionIfAvailable);
            return await mkdirp(directory, mode, useNativeRecursiveOptionIfAvailable);
        }
        if (isEEXIST(error)) {
            const stats = await stat(directory);
            if (stats.isDirectory()) {
                return false;
            }
        }
        throw error;
    }
};
