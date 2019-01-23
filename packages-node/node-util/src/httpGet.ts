import {console, Object, Error} from '@nlib/global';
import {join, dirname} from 'path';
import {Readable, PassThrough} from 'stream';
import {Stats} from 'fs';
import {stat, createReadStream, createWriteStream, mkdirp} from '@nlib/afs';
import {request} from './request';

export const sanitizeEtag = (etag: string): string => etag
.replace(/\s/g, '_')
.replace(/\W/g, (c) => `_${(c.codePointAt(0) || 0).toString(16)}_`);

export interface IResponseStream extends Readable {
    fromCache: boolean,
    cachePromise: Promise<Stats> | null,
}

const readFromCache = async (cacheDirectory: string, cacheId: string): Promise<IResponseStream> => {
    const cachePath = join(cacheDirectory, sanitizeEtag(cacheId));
    const stats = await stat(cachePath);
    if (stats.isFile()) {
        return Object.assign(createReadStream(cachePath), {fromCache: true, cachePromise: null});
    } else {
        throw Object.assign(new Error(`There is non-file object at ${cachePath}`), {code: 'EEXISTS'});
    }
};

const writeToCache = async (stream: Readable, cacheDirectory: string, cacheId: string): Promise<Stats> => {
    const cachePath = join(cacheDirectory, sanitizeEtag(cacheId));
    await mkdirp(dirname(cachePath));
    const writer = createWriteStream(cachePath);
    try {
        await new Promise<void>((resolve, reject) => {
            stream.pipe(writer)
            .once('finish', resolve)
            .once('error', reject);
        });
    } catch (error) {
        console.log(`Failed to write: ${cachePath}`);
        throw error;
    }
    return stat(cachePath);
};

export const httpGet = async (
    url: string | URL,
    cacheDirectory?: string,
): Promise<IResponseStream> => {
    if (cacheDirectory) {
        const {headers} = await request(url, {method: 'HEAD'});
        const id = headers.etag || headers['last-modified'];
        if (typeof id === 'string') {
            try {
                return (await readFromCache(cacheDirectory, id));
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }
        }
    }
    const response = await request(url);
    if (response.statusCode !== 200) {
        throw new Error(`response.statusCode is not 200: ${response.statusCode}`);
    }
    let cachePromise = null;
    if (cacheDirectory) {
        const {headers} = response;
        const id = headers.etag || headers['last-modified'];
        if (typeof id === 'string') {
            cachePromise = writeToCache(response.pipe(new PassThrough()), cacheDirectory, id);
        }
    }
    return Object.assign(response.pipe(new PassThrough()), {fromCache: false, cachePromise});
};
