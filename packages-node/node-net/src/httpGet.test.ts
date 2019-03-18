import anyTest, {TestInterface} from 'ava';
import {mktempdir, readFile, mkdirp} from '@nlib/afs';
import {join} from 'path';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {httpGet, sanitizeEtag} from './httpGet';
import {readStream} from '@nlib/node-stream';
import * as index from './index';

const test = anyTest as TestInterface<{
    NORMAL_GET: string,
    CACHE_SLOW: string,
    CACHE_GET: string,
    CACHE_DATE_GET: string,
    NOT_FOUND: string,
    directory: string,
    server: Server,
    baseURL: URL,
    etag: string,
    lastModified: Date,
    data: string,
    cachePath1: string,
    cachePath2: string,
}>;


test.beforeEach(async (t) => {
    const server = t.context.server = createServer((req, res) => {
        switch (req.url) {
        case t.context.CACHE_SLOW:
            res.setHeader('etag', t.context.etag);
            res.writeHead(200);
            res.write(t.context.data);
            setTimeout(() => {
                res.write(t.context.data);
                setTimeout(() => {
                    res.write(t.context.data);
                    setTimeout(() => res.end(t.context.data), 50);
                }, 50);
            }, 50);
            return;
        case t.context.NORMAL_GET:
            res.writeHead(200);
            break;
        case t.context.CACHE_GET:
            res.setHeader('etag', t.context.etag);
            res.writeHead(200);
            break;
        case t.context.CACHE_DATE_GET:
            res.setHeader('Last-Modified', t.context.lastModified.toUTCString());
            res.writeHead(200);
            break;
        case t.context.NOT_FOUND:
        default:
            res.writeHead(404);
        }
        if (req.method === 'GET') {
            res.write(t.context.data);
        }
        res.end();
    });
    t.context.NORMAL_GET = '/normal-get';
    t.context.CACHE_GET = '/cache-get';
    t.context.CACHE_SLOW = '/cache-slow-get';
    t.context.CACHE_DATE_GET = '/cache-date-get';
    t.context.NOT_FOUND = '/404';
    t.context.etag = 'foobar1234567890';
    t.context.data = '<data>';
    t.context.lastModified = new Date();
    t.context.directory = await mktempdir();
    t.context.cachePath1 = join(t.context.directory, sanitizeEtag(t.context.etag));
    t.context.cachePath2 = join(t.context.directory, sanitizeEtag(t.context.lastModified.toUTCString()));
    t.context.baseURL = new URL('http://localhost');
    t.context.baseURL.port = `${await listenPort(server)}`;
});

test.afterEach(async (t) => {
    await closeServers(t.context.server);
});

test('index.httpGet', (t) => {
    t.is(index.httpGet, httpGet);
});

test('request https://example.com/', async (t) => {
    const res = await httpGet('https://example.com/');
    t.false(res.fromCache);
});

test('request http', async (t) => {
    const url = new URL(t.context.NORMAL_GET, t.context.baseURL);
    const res = await httpGet(url);
    t.false(res.fromCache);
});

test('request cached', async (t) => {
    const url = new URL(t.context.CACHE_GET, t.context.baseURL);
    const res1 = await httpGet(url, t.context.directory);
    const body1 = await readStream(res1);
    const stats = await res1.cachePromise;
    t.false(res1.fromCache);
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const body2 = await readStream(res2);
    t.is(`${body1}`, `${body2}`);
    t.is(`${body2}`, await readFile(t.context.cachePath1, 'utf8'));
    t.true(stats && 0 < stats.size);
});

test('request cached by last modified', async (t) => {
    const url = new URL(t.context.CACHE_DATE_GET, t.context.baseURL);
    const res1 = await httpGet(url, t.context.directory);
    t.false(res1.fromCache);
    await res1.cachePromise;
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const stats = await res1.cachePromise;
    t.true(stats && 0 < stats.size);
    const body1 = await readStream(res1);
    const body2 = await readStream(res2);
    t.is(`${body1}`, `${body2}`);
    t.is(`${body2}`, await readFile(t.context.cachePath2, 'utf8'));
});

test('cache slow stream', async (t) => {
    const url = new URL(t.context.CACHE_SLOW, t.context.baseURL);
    const res1 = await httpGet(url, t.context.directory);
    t.false(res1.fromCache);
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const body1 = await readStream(res1);
    const body2 = await readStream(res2);
    t.is(`${body1}`, `${body2}`);
    t.is(`${body2}`, await readFile(t.context.cachePath1, 'utf8'));
});

test('request 404', async (t) => {
    const url = new URL(t.context.NOT_FOUND, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url);
    }, {code: 'EResponse'});
});

test('fail to read cache', async (t) => {
    await mkdirp(t.context.cachePath1);
    const url = new URL(t.context.CACHE_GET, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url, t.context.directory);
    });
});
