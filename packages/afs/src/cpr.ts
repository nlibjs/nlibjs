import {join, dirname} from 'path';
import {PathLike} from 'fs';
import {copyFile, symlink, readlink} from './core';
import {tree, TreeNode} from './tree';
import {mkdirp} from './mkdirp';
import {absolutify} from './absolutify';

const cprCore = async (tree: TreeNode, dest: string) => {
    switch (tree.type) {
    case 'file':
        await copyFile(tree.path, dest);
        break;
    case 'directory':
        await mkdirp(dest);
        await Promise.all(Object.keys(tree.files).map(async (name) => {
            const file = tree.files[name];
            await cprCore(file, join(dest, name));
        }));
        break;
    case 'symboliclink':
        await symlink(await readlink(tree.path), dest);
        break;
    default:
        throw new Error(`${tree.type} is not supported: ${tree.path}`);
    }
};

export const cpr = async (src: PathLike, dest: string) => {
    src = absolutify(src);
    dest = absolutify(dest);
    await mkdirp(dirname(dest));
    await cprCore(await tree(src), dest);
};
