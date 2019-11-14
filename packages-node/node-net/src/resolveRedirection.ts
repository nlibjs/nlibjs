import {URL} from 'url';
import {IncomingMessage, OutgoingHttpHeaders} from 'http';
import {CookieStore} from '@nlib/cookie';
import {NlibError} from '@nlib/util';
import {request} from './request';

export interface IResolveRedirectionOptions {
    history?: Array<URL>,
    maxRedirections?: number,
    cookie?: CookieStore | null | boolean,
    debug?: boolean,
}

export const isRedirection = (
    statusCode: number,
): boolean => Number.isSafeInteger(statusCode) && 300 <= statusCode && statusCode < 400;

const _resolveRedirection = async (
    origin: URL,
    response: IncomingMessage,
    history: Array<URL>,
    maxRedirections: number,
    cookie: CookieStore | null,
    debug: boolean,
): Promise<IncomingMessage> => {
    if (!isRedirection(response.statusCode || 500)) {
        return response;
    }
    const {location} = response.headers;
    if (!location) {
        return response;
    }
    if (!(history.length <= maxRedirections)) {
        throw new NlibError({
            code: 'TooManyRedirections',
            message: `TooManyRedirections:\n${history.join('\n→ ')}`,
            data: history,
        });
    }
    const url = new URL(location, origin);
    if (debug) {
        process.stdout.write(`Redirected: ${url}`);
    }
    const method = 'GET';
    const headers: OutgoingHttpHeaders = {};
    if (cookie) {
        cookie.consumeIncomingMessage(response, origin);
        headers.cookie = cookie.getCookieStringFor(method, url, origin);
    }
    return _resolveRedirection(
        url,
        await request(url, {method, headers, resolveRedirection: null}),
        history.concat(origin),
        maxRedirections,
        cookie,
        debug,
    );
};

export const resolveRedirection = async (
    origin: URL,
    originalResponse: IncomingMessage,
    {
        history = [],
        maxRedirections = 2,
        cookie = null,
        debug,
    }: IResolveRedirectionOptions,
): Promise<IncomingMessage> => {
    const response = await _resolveRedirection(
        origin,
        originalResponse,
        [...history],
        maxRedirections,
        cookie === true ? new CookieStore() : cookie || null,
        Boolean(debug),
    );
    return response;
};
