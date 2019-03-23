import {URL} from 'url';
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
import {NlibError} from '@nlib/util';

export const request = (
    src: string | URL,
    options: RequestOptionsHTTP | RequestOptionsHTTPS = {},
    data?: Readable | Buffer | string,
): Promise<IncomingMessage> => {
    const url = new URL(`${src}`);
    const request = url.protocol === 'https:' ? requestHTTPS : requestHTTP;
    return new Promise((resolve, reject) => {
        const req = request(
            {
                protocol: url.protocol,
                auth: `${url.username || ''}${url.password ? `:${url.password}` : ''}`,
                host: url.hostname,
                port: url.port,
                path: url.pathname,
                ...options,
            },
            resolve,
        )
        .once('error', reject);
        if (data) {
            if (typeof data === 'string' || Buffer.isBuffer(data)) {
                req.end(data);
            } else if (typeof data.pipe === 'function') {
                data.pipe(req);
            } else {
                reject(new NlibError({
                    code: 'node-net/request/1',
                    message: `Invalid data: ${data}`,
                    data: {src, options, data},
                }));
            }
        } else {
            req.end();
        }
    });
};
