import {Error, URL} from '@nlib/global';
import {
    request as requestHTTP,
    RequestOptions as RequestOptionsHTTP,
    IncomingMessage,
} from 'http';
import {
    request as requestHTTPS,
    RequestOptions as RequestOptionsHTTPS,
} from 'https';
import {Readable} from 'stream';

export const request = (
    src: string | URL,
    options: RequestOptionsHTTP | RequestOptionsHTTPS = {},
    data?: Readable | Buffer | string,
): Promise<IncomingMessage> => {
    const url = new URL(`${src}`);
    const request = url.protocol === 'https:' ? requestHTTPS : requestHTTP;
    return new Promise((resolve, reject) => {
        const req = request(url, options, resolve)
        .once('error', reject);
        if (data) {
            if (typeof data === 'string' || Buffer.isBuffer(data)) {
                req.end(data);
            } else if (typeof data.pipe === 'function') {
                data.pipe(req);
            } else {
                reject(new Error(`Invalid data: ${data}`));
            }
        } else {
            req.end();
        }
    });
};
