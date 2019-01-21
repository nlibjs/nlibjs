import anyTest, {TestInterface} from 'ava';
import {URL} from '@nlib/global';
import {mktempdir} from '@nlib/afs';
import {request} from './request';
import * as index from '.';
import {Server, createServer} from 'http';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {readStream} from './readStream';
import {PassThrough} from 'stream';

const test = anyTest as TestInterface<{
    directory: string,
    server: Server,
    baseURL: URL,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
    const server = t.context.server = createServer((req, res) => {
        t.log(`${req.method} ${req.url}`);
        res.writeHead(200, {
            ...req.headers,
            path: req.url,
            method: req.method,
        });
        req.pipe(res);
    });
    const baseURL = t.context.baseURL = new URL('http://localhost');
    baseURL.port = `${await listenPort(server)}`;
});

test.afterEach(async (t) => {
    await closeServers(t.context.server);
});

test('index.request', (t) => {
    t.is(index.request, request);
});

test('GET https://example.com/', async (t) => {
    const res = await request('https://example.com/');
    t.is(res.statusCode, 200);
});

test('POST https://localhost/foo (string)', async (t) => {
    const data = 'foobar';
    const url = new URL(`${t.context.baseURL}`);
    url.pathname = '/foo';
    const res = await request(url, {method: 'POST'}, data);
    t.is(res.statusCode, 200);
    t.is(res.headers.path, '/foo');
    t.is(res.headers.method, 'POST');
    const loaded = await readStream(res);
    t.is(`${loaded}`, data);
});

test('POST https://localhost/foo (stream)', async (t) => {
    const data = 'foobar';
    const input = new PassThrough();
    setImmediate(() => {
        input.end(data);
    });
    const url = new URL(`${t.context.baseURL}`);
    url.pathname = '/foo';
    const res = await request(url, {method: 'POST'}, input);
    t.is(res.statusCode, 200);
    t.is(res.headers.path, '/foo');
    t.is(res.headers.method, 'POST');
    const loaded = await readStream(res);
    t.is(`${loaded}`, data);
});
