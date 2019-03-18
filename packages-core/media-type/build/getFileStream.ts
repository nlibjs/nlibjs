import {join} from 'path';
import {Readable} from 'stream';
import {httpGet} from '@nlib/node-net';
export const getFileStream = (url: string | URL): Promise<Readable> => {
    const cacheDirectory = join(__dirname, '__cache');
    return httpGet(url, cacheDirectory);
};
