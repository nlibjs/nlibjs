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

export const request = async (
    src: string | URL,
    options: RequestOptionsHTTP | RequestOptionsHTTPS = {},
    data: Readable | Buffer | string | null = null,
): Promise<IncomingMessage> => {
    const url = new URL(`${src}`);
    const request = url.protocol === 'https:' ? requestHTTPS : requestHTTP;
    const req = await new Promise<IncomingMessage>((resolve, reject) => {
        const req = request(
            {
                protocol: url.protocol,
                auth: `${url.username || ''}${url.password ? `:${url.password}` : ''}`,
                host: url.hostname,
                port: url.port,
                path: `${url.pathname}${url.search}`,
                ...options,
            },
            resolve,
        )
        .once('error', reject);
        if (!data || typeof data === 'string' || Buffer.isBuffer(data)) {
            req.end(data);
        } else {
            data.pipe(req);
        }
    });
    return req;
};
