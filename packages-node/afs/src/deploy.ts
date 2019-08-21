import {join} from 'path';
import {writeFilep} from './writeFilep';
import {PathLike} from 'fs';
import {absolutify} from './absolutify';

export type DeployData = string | Buffer | {
    [key: string]: DeployData,
};

const deployCore = async (
    dest: string,
    data: DeployData,
): Promise<void> => {
    if (typeof data === 'string' || Buffer.isBuffer(data)) {
        await writeFilep(dest, data);
    } else {
        await Promise.all(
            Object.keys(data)
            .map(async (name) => {
                await deployCore(join(dest, name), data[name]);
            }),
        );
    }
};

export const deploy = async (
    directory: PathLike,
    data: DeployData,
): ReturnType<typeof deployCore> => {
    await deployCore(absolutify(directory), data);
};
