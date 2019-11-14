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
    const createRequest = url.protocol === 'https:' ? requestHTTPS : requestHTTP;
    const response = await new Promise<IncomingMessage>((resolve, reject) => {
        const request = createRequest({
            protocol: url.protocol,
            auth: `${url.username || ''}${url.password ? `:${url.password}` : ''}`,
            host: url.hostname,
            port: url.port,
            path: `${url.pathname}${url.search}`,
            ...options,
        });
        request.once('error', reject);
        request.once('response', resolve);
        if (!data || typeof data === 'string' || Buffer.isBuffer(data)) {
            request.end(data);
        } else {
            data.pipe(request);
        }
    });
    return response;
};
