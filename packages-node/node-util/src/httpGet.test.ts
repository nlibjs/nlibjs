import anyTest, {TestInterface} from 'ava';
import {URL} from '@nlib/global';
import {mktempdir, readFile, mkdirp} from '@nlib/afs';
import {join} from 'path';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {httpGet, sanitizeEtag} from './httpGet';
import * as index from './index';
import {readStream} from './readStream';

const test = anyTest as TestInterface<{
    NORMAL_GET: '/normal-get',
    CACHE_GET: '/cache-get',
    NOT_FOUND: '/404',
    directory: string,
    server: Server,
    baseURL: URL,
    etag: string,
    cacheDest: string,
    data: string,
}>;


test.beforeEach(async (t) => {
    t.context.NORMAL_GET = '/normal-get';
    t.context.CACHE_GET = '/cache-get';
    t.context.NOT_FOUND = '/404';
    t.context.directory = await mktempdir();
    t.context.etag = 'foobar1234567890';
    t.context.cacheDest = join(t.context.directory, sanitizeEtag(t.context.etag));
    t.context.data = t.context.etag.repeat(100);
    const server = t.context.server = createServer((req, res) => {
        switch (req.url) {
        case t.context.CACHE_GET:
            res.writeHead(200, {etag: t.context.etag});
            if (req.method === 'GET') {
                res.write(t.context.data);
            }
            break;
        case t.context.NOT_FOUND:
            res.writeHead(404);
            break;
        default:
            res.writeHead(200);
        }
        res.end();
    });
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
    t.false(res1.fromCache);
    await res1.cachePromise;
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const stats = await res1.cachePromise;
    t.true(stats && 0 < stats.size);
    t.is(`${await readStream(res2)}`, await readFile(t.context.cacheDest, 'utf8'));
});

test('request 404', async (t) => {
    const url = new URL(t.context.NOT_FOUND, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url);
    });
});

test('fail to read cache', async (t) => {
    await mkdirp(t.context.cacheDest);
    const url = new URL(t.context.CACHE_GET, t.context.baseURL);
    await t.throwsAsync(async () => {
        await httpGet(url, t.context.directory);
    });
});
