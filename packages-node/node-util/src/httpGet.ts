import {console, Object, Error} from '@nlib/global';
import {join, dirname} from 'path';
import {Readable} from 'stream';
import {Stats} from 'fs';
import {stat, createReadStream, createWriteStream, mkdirp} from '@nlib/afs';
import {request} from './request';
const sanitizeEtag = (etag: string): string => etag.replace(/\W/g, (c) => `_${(c.codePointAt(0) || 0).toString(16)}_`);

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

const writeToCache = (stream: Readable, cachePath: string): Promise<void> => mkdirp(dirname(cachePath))
.then(() => new Promise<void>((resolve, reject) => {
    stream.pipe(createWriteStream(cachePath))
    .once('finish', resolve)
    .once('error', reject);
}));

export const httpGet = async (
    url: string | URL,
    cacheDirectory?: string,
): Promise<IResponseStream> => {
    if (cacheDirectory) {
        const {headers: {etag}} = await request(url, {method: 'HEAD'});
        if (typeof etag === 'string') {
            const cachePath = join(cacheDirectory, `${sanitizeEtag(etag)}`);
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
        const {headers: {etag}} = response;
        if (typeof etag === 'string') {
            const cacheDest = join(cacheDirectory, `${sanitizeEtag(etag)}`);
            cachePromise = writeToCache(response, cacheDest)
            .then(() => stat(cacheDest))
            .catch((error) => {
                console.error(error);
                throw error;
            });
        }
    }
    return Object.assign(response, {fromCache: false, cachePromise});
};
