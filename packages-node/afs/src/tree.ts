import {PathLike} from 'fs';
import {join, basename} from 'path';
import {absolutify} from '@nlib/node-util';
import {lstat, readdir} from './core';
import {IFileInfo} from './walkDirectory';

export interface ITreeNode extends IFileInfo {
    files: ITreeBranches,
}

export interface ITreeBranches {
    [key: string]: ITreeNode,
}

export const tree = async (file: PathLike): Promise<ITreeNode> => {
    const files: ITreeBranches = {};
    const stats = await lstat(file);
    if (stats.isDirectory()) {
        const branches = await Promise.all(
            (await readdir(file))
            .map(async (name) => {
                const result = await tree(join(`${file}`, name));
                return result;
            }),
        );
        for (const branch of branches) {
            files[basename(branch.path)] = branch;
        }
    }
    return {
        path: absolutify(file),
        stats,
        files,
    };
};
