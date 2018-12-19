import {join, dirname} from 'path';
import {stat} from './core';
import {absolutify} from './absolutify';

const findUpCore = async (targets: string[], directory: string): Promise<string | null> => {
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

export const findUp = (filenames: string | string[], directory = process.cwd()) => findUpCore(Array.isArray(filenames) ? filenames : [filenames], absolutify(directory));
