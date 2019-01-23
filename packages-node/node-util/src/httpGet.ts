import {console, Object, Error} from '@nlib/global';
import {join, dirname} from 'path';
import {Readable} from 'stream';
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

const readFromCache = async (cachePath: string): Promise<IResponseStream> => {
    const stats = await stat(cachePath);
    if (stats.isFile()) {
        return Object.assign(createReadStream(cachePath), {fromCache: true, cachePromise: null});
    } else {
        throw Object.assign(new Error(`There is non-file object at ${cachePath}`), {code: 'EEXISTS'});
    }
};

const writeToCache = async (stream: Readable, cachePath: string): Promise<void> => {
    try {
        await mkdirp(dirname(cachePath));
        await new Promise<void>((resolve, reject) => {
            stream.pipe(createWriteStream(cachePath))
            .once('finish', resolve)
            .once('error', reject);
        });
    } catch (error) {
        console.log(`Failed to write: ${cachePath}`);
        throw error;
    }
};

export const httpGet = async (
    url: string | URL,
    cacheDirectory?: string,
): Promise<IResponseStream> => {
    if (cacheDirectory) {
        const {headers} = await request(url, {method: 'HEAD'});
        const id = headers.etag || headers['last-modified'];
        if (typeof id === 'string') {
            const cachePath = join(cacheDirectory, sanitizeEtag(id));
            try {
                return (await readFromCache(cachePath));
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
            const cachePath = join(cacheDirectory, sanitizeEtag(id));
            cachePromise = writeToCache(response, cachePath)
            .then(() => {
                return stat(cachePath)
                .catch((error) => {
                    throw error;
                });
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
        }
    }
    return Object.assign(response, {fromCache: false, cachePromise});
};
