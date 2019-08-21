import * as path from 'path';
import {Readable} from 'stream';
import {httpGet} from '@nlib/node-net';
export const getFileStream = async (url: string | URL): Promise<Readable> => {
    const cacheDirectory = path.join(__dirname, '__cache');
    const res = await httpGet(url, cacheDirectory);
    return res;
};
