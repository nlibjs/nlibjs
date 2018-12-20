import {join, basename} from 'path';
import {lstat, readdir} from './core';
import {absolutify} from './absolutify';
import {PathLike} from 'fs';

export type TreeNodeType =
| 'file'
| 'directory'
| 'symboliclink'
| 'socket'
| 'characterdevice'
| 'blockdevice'
| 'fifo';

export interface TreeBranches {
    [key: string]: TreeNode
}

export interface TreeNode {
    path: string
    type: TreeNodeType
    size: number
    files: TreeBranches
}

export const tree = async (file: PathLike): Promise<TreeNode> => {
    let type: TreeNodeType = 'file';
    const files: TreeBranches = {};
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

