import {PathLike, Stats} from 'fs';
import {join} from 'path';
import {lstat, readdir} from './core';
import {absolutify} from './absolutify';
import {Readable} from 'stream';

export interface IFileInfo {
    path: string,
    stats: Stats,
}

// export const walkDirectory = async function* (file: PathLike): AsyncIterator<IFileInfo> {
//     const stats = await lstat(file);
//     yield {path: absolutify(file), stats};
//     if (stats.isDirectory()) {
//         for (const name of await readdir(file)) {
//             const iterator = walkDirectory(join(`${file}`, name));
//             while (1) {
//                 const {done, value} = await iterator.next();
//                 if (done) {
//                     break;
//                 }
//                 yield value;
//             }
//         }
//     }
// };

export class DirectoryWalker extends Readable {

    public path: string

    public walking: boolean

    public constructor(file: PathLike) {
        super({objectMode: true});
        this.path = absolutify(file);
        this.walking = false;
    }

    public _read(): void {
        if (this.walking) {
            return;
        }
        this.walking = true;
        this.walk(this.path)
        .then(() => {
            this.push(null);
        })
        .catch((error) => {
            this.destroy(error);
        });
    }

    protected async walk(absolutePath: string, depth = 0): Promise<void> {
        const stats = await lstat(absolutePath);
        this.push({path: absolutePath, stats});
        if (!stats.isDirectory()) {
            return;
        }
        await Promise.all(
            (await readdir(absolutePath))
            .map((name) => this.walk(join(`${absolutePath}`, name), depth + 1)),
        );
    }

}

export const createDirectoryWalker = (file: PathLike): DirectoryWalker => new DirectoryWalker(file);
