import * as path from 'path';
import * as stream from 'stream';
import {httpGet} from '@nlib/node-net';
export const getFileStream = async (url: string | URL): Promise<stream.Readable> => {
    const cacheDirectory = path.join(__dirname, '__cache');
    const res = await httpGet(url, cacheDirectory);
    return res;
};
