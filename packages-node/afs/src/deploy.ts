import {join} from 'path';
import {absolutify} from '@nlib/node-util';
import {writeFilep} from './writeFilep';
import {PathLike} from 'fs';

export type DeployData = string | Buffer | {
    [key: string]: DeployData,
};

const deployCore = async (dest: string, data: DeployData): Promise<void> => {
    if (typeof data === 'string' || Buffer.isBuffer(data)) {
        await writeFilep(dest, data);
    } else {
        await Promise.all(Object.keys(data).map((name) => deployCore(join(dest, name), data[name])));
    }
};

export const deploy = (
    directory: PathLike,
    data: DeployData,
): ReturnType<typeof deployCore> => deployCore(absolutify(directory), data);
