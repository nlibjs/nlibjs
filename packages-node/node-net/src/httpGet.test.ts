import {URL} from 'url';
import anyTest, {TestInterface, ExecutionContext} from 'ava';
import {mktempdir, readFile, mkdirp} from '@nlib/afs';
import {join} from 'path';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {httpGet, sanitizeEtag} from './httpGet';
import {readStream} from '@nlib/node-stream';

interface ITestContext {
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
}

const test = anyTest as TestInterface<ITestContext>;

const createTestServer = (
    t: ExecutionContext<ITestContext>,
): Server => createServer((req, res) => {
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

test.beforeEach(async (t) => {
    const server = createTestServer(t);
    const [directory, port] = await Promise.all([
        mktempdir(),
        listenPort(server),
    ]);
    const etag = 'foobar1234567890';
    const lastModified = new Date();
    Object.assign(t.context, {
        server,
        NORMAL_GET: '/normal-get',
        CACHE_GET: '/cache-get',
        CACHE_SLOW: '/cache-slow-get',
        CACHE_DATE_GET: '/cache-date-get',
        NOT_FOUND: '/404',
        etag: 'foobar1234567890',
        data: '<data>',
        lastModified: new Date(),
        directory,
        cachePath1: join(directory, sanitizeEtag(etag)),
        cachePath2: join(directory, sanitizeEtag(lastModified.toUTCString())),
        baseURL: `http://localhost:${port}`,
    });
});

test.afterEach(async (t) => {
    await closeServers(t.context.server);
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
