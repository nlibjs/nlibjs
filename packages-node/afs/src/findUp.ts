import {Array} from '@nlib/node-global';
import {join, dirname} from 'path';
import {absolutify} from '@nlib/node-util';
import {stat} from './core';

const findUpCore = async (
    targets: Array<string>,
    directory: string,
): Promise<string | null> => {
    for (const target of targets) {
        const file = join(directory, target);
        try {
            const stats = await stat(file);
            if (stats.isFile()) {
                return file;
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    const parentDirectory = dirname(directory);
    if (parentDirectory !== directory) {
        return findUpCore(targets, dirname(directory));
    }
    return null;
};

export const findUp = (
    filenames: string | Array<string>,
    directory = process.cwd(),
): Promise<string | null> => findUpCore(Array.isArray(filenames) ? filenames : [filenames], absolutify(directory));
