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

const cprCore = async (node: ITreeNode, dest: string, context: ICopyContext): Promise<void> => {
    const {stats} = node;
    if (stats.isFile()) {
        await copyFile(node.path, dest);
    } else if (stats.isDirectory()) {
        await mkdirp(dest);
        await Promise.all(
            Object.entries(node.files)
            .map(([name, childNode]) => cprCore(childNode, join(dest, name), context))
        );
    } else if (stats.isSymbolicLink()) {
        const source = node.path;
        const target = await readlink(source);
        const isRelative = !isAbsolute(target);
        const absoluteTarget = isRelative ? join(dirname(source), target) : target;
        if (absoluteTarget.startsWith(context.src)) {
            const copiedTarget = join(context.dest, relative(context.src, target));
            await symlink(isRelative ? target : copiedTarget, dest);
        } else {
            await symlink(isRelative ? relative(dirname(dest), absoluteTarget) : target, dest);
        }
    } else {
        throw Object.assign(
            new Error(`Unsupported file: ${node.path}`),
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
