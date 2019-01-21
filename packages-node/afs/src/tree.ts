import {PathLike} from 'fs';
import {join, basename} from 'path';
import {lstat, readdir} from './core';
import {absolutify} from './absolutify';

export type TreeNodeType =
| 'file'
| 'directory'
| 'symboliclink'
| 'socket'
| 'characterdevice'
| 'blockdevice'
| 'fifo';

export interface ITreeNode {
    path: string,
    type: TreeNodeType,
    size: number,
    files: ITreeBranches,
}

export interface ITreeBranches {
    [key: string]: ITreeNode,
}

export const tree = async (file: PathLike): Promise<ITreeNode> => {
    let type: TreeNodeType = 'file';
    const files: ITreeBranches = {};
    const stats = await lstat(file);
    if (stats.isDirectory()) {
        type = 'directory';
        const branches = (await Promise.all(
            (await readdir(file)).map((name) => tree(join(`${file}`, name)))
        ));
        for (const branch of branches) {
            files[basename(branch.path)] = branch;
        }
    } else if (stats.isSymbolicLink()) {
        type = 'symboliclink';
    } else if (stats.isSocket()) {
        type = 'socket';
    } else if (stats.isCharacterDevice()) {
        type = 'characterdevice';
    } else if (stats.isBlockDevice()) {
        type = 'blockdevice';
    } else if (stats.isFIFO()) {
        type = 'fifo';
    }
    return {
        path: absolutify(file),
        type,
        size: stats.size,
        files,
    };
};

