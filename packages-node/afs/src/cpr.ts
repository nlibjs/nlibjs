import {join, dirname, isAbsolute, relative} from 'path';
import {PathLike} from 'fs';
import {copyFile, symlink, readlink} from './core';
import {tree, ITreeNode} from './tree';
import {mkdirp} from './mkdirp';
import {absolutify} from './absolutify';

interface ICopyContext {
    src: string,
    dest: string,
}

const cprCore = async (tree: ITreeNode, dest: string, context: ICopyContext): Promise<void> => {
    switch (tree.type) {
    case 'file':
        await copyFile(tree.path, dest);
        break;
    case 'directory':
        await mkdirp(dest);
        await Promise.all(Object.keys(tree.files).map(async (name) => {
            const file = tree.files[name];
            await cprCore(file, join(dest, name), context);
        }));
        break;
    case 'symboliclink': {
        const target = await readlink(tree.path);
        const isRelative = !isAbsolute(target);
        const absoluteTarget = isRelative ? join(dirname(tree.path), target) : target;
        if (absoluteTarget.startsWith(context.src)) {
            const copiedTarget = join(context.dest, relative(context.src, target));
            await symlink(isRelative ? target : copiedTarget, dest);
        } else {
            await symlink(isRelative ? relative(dirname(dest), absoluteTarget) : target, dest);
        }
        break;
    }
    default:
        throw Object.assign(
            new Error(`${tree.type} is not supported: ${tree.path}`),
            {code: 'ENOTSUPPORTED'},
        );
    }
};

export const cpr = async (src: PathLike, dest: string): ReturnType<typeof cprCore> => {
    src = absolutify(src);
    dest = absolutify(dest);
    await mkdirp(dirname(dest));
    await cprCore(await tree(src), dest, {src, dest});
};
