import {PathLike} from 'fs';
import {readFile} from './core';

export const isSameFile = async (
    pathA: PathLike,
    pathB: PathLike,
    dataA?: Buffer,
    dataB?: Buffer,
): Promise<boolean> => {
    const bufferA: Buffer = dataA || await readFile(pathA);
    const bufferB: Buffer = dataB || await readFile(pathB);
    return bufferA.equals(bufferB);
};
