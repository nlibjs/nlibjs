import {PathLike, Stats} from 'fs';
import {join} from 'path';
import {lstat, readdir} from './core';
import {absolutify} from './absolutify';

export interface IFileInfo {
    path: string,
    stats: Stats,
}

export const walkDirectory = async function* (file: PathLike): AsyncIterator<IFileInfo> {
    const stats = await lstat(file);
    yield {path: absolutify(file), stats};
    if (stats.isDirectory()) {
        for (const name of await readdir(file)) {
            const iterator = walkDirectory(join(`${file}`, name));
            while (1) {
                const {done, value} = await iterator.next();
                if (done) {
                    break;
                }
                yield value;
            }
        }
    }
};
