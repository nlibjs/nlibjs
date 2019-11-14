import {URL} from 'url';
import {
    request as requestHTTP,
    IncomingMessage,
} from 'http';
import {
    request as requestHTTPS,
    RequestOptions as RequestOptionsHTTPS,
} from 'https';
import {Readable} from 'stream';
import {
    resolveRedirection,
    IResolveRedirectionOptions,
} from './resolveRedirection';

export interface IHTTPRequestOptions extends RequestOptionsHTTPS {
    resolveRedirection?: IResolveRedirectionOptions | boolean | null,
}

export const request = async (
    src: string | URL,
    options: IHTTPRequestOptions = {},
    data: Readable | Buffer | string | null = null,
): Promise<IncomingMessage> => {
    const url = new URL(`${src}`);
    const createRequest = url.protocol === 'https:' ? requestHTTPS : requestHTTP;
    const response = await new Promise<IncomingMessage>((resolve, reject) => {
        const requestOptions = {
            protocol: url.protocol,
            auth: `${url.username || ''}${url.password ? `:${url.password}` : ''}`,
            host: url.hostname,
            port: url.port,
            path: `${url.pathname}${url.search}`,
            ...options,
        };
        delete requestOptions.resolveRedirection;
        const request = createRequest(requestOptions);
        request.once('error', reject);
        request.once('response', resolve);
        if (!data || typeof data === 'string' || Buffer.isBuffer(data)) {
            request.end(data);
        } else {
            data.pipe(request);
        }
    });
    if (options.resolveRedirection) {
        return resolveRedirection(
            url,
            response,
            options.resolveRedirection === true ? {} : options.resolveRedirection,
        );
    }
    return response;
};
