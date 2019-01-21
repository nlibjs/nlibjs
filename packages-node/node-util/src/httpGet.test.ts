import anyTest, {TestInterface} from 'ava';
import {URL} from '@nlib/global';
import {mktempdir} from '@nlib/afs';
import {httpGet} from './httpGet';
import * as index from '.';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';

const test = anyTest as TestInterface<{
    directory: string,
    server: Server,
    baseURL: URL,
    etag: string,
    data: string,
}>;

const NORMAL_GET = '/normal-get';
const CACHE_GET = '/cache-get';

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
    t.context.etag = 'foobar1234567890';
    t.context.data = t.context.etag.repeat(100);
    const server = t.context.server = createServer((req, res) => {
        t.log(`${req.method} ${req.url}`);
        switch (req.url) {
        case CACHE_GET:
            res.writeHead(200, {
                etag: t.context.etag,
            });
            if (req.method === 'GET') {
                res.write(t.context.data);
            }
            break;
        default:
            res.writeHead(200);
        }
        res.end();
    });
    const baseURL = t.context.baseURL = new URL('http://localhost');
    baseURL.port = `${await listenPort(server)}`;
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

test(`request ${NORMAL_GET}`, async (t) => {
    const url = new URL(NORMAL_GET, t.context.baseURL);
    const res = await httpGet(url);
    t.false(res.fromCache);
});

test(`request ${CACHE_GET}`, async (t) => {
    const url = new URL(CACHE_GET, t.context.baseURL);
    const res1 = await httpGet(url, t.context.directory);
    t.false(res1.fromCache);
    await res1.cachePromise;
    const res2 = await httpGet(url, t.context.directory);
    t.true(res2.fromCache);
    const stats = await res1.cachePromise;
    t.true(stats && 0 < stats.size);
});
