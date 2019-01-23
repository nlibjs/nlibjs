import anyTest, {TestInterface} from 'ava';
import {URL, Date, Object} from '@nlib/global';
import {mktempdir, readFile, mkdirp} from '@nlib/afs';
import {join} from 'path';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {httpGet, sanitizeEtag} from './httpGet';
import * as index from './index';
import {readStream} from './readStream';

const test = anyTest as TestInterface<{
    NORMAL_GET: string,
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
    const NORMAL_GET = '/normal-get';
    const CACHE_GET = '/cache-get';
    const CACHE_DATE_GET = '/cache-date-get';
    const NOT_FOUND = '/404';
    const directory = await mktempdir();
    const etag = 'foobar1234567890';
    const data = etag.repeat(100);
    const lastModified = new Date();
    const cachePath1 = join(directory, sanitizeEtag(etag));
    const cachePath2 = join(directory, sanitizeEtag(lastModified.toUTCString()));
    const baseURL = new URL('http://localhost');
    baseURL.port = `${await listenPort(server)}`;
    Object.assign(t.context, {
        NORMAL_GET,
        CACHE_GET,
        CACHE_DATE_GET,
        NOT_FOUND,
        directory,
        etag,
        data,
        lastModified,
        cachePath1,
        cachePath2,
        baseURL,
    });
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
    t.false(res1.fromCache);
    await res1.cachePromise;
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const stats = await res1.cachePromise;
    t.true(stats && 0 < stats.size);
    t.is(`${await readStream(res2)}`, await readFile(t.context.cachePath1, 'utf8'));
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
    t.is(`${await readStream(res2)}`, await readFile(t.context.cachePath2, 'utf8'));
});

test('request 404', async (t) => {
    const url = new URL(t.context.NOT_FOUND, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url);
    });
});

test('fail to read cache', async (t) => {
    await mkdirp(t.context.cachePath1);
    const url = new URL(t.context.CACHE_GET, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url, t.context.directory);
    });
});
