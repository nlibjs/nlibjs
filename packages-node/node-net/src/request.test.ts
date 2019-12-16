import {URL} from 'url';
import anyTest, {TestInterface} from 'ava';
import {Server, createServer} from 'http';
import {readStream} from '@nlib/node-stream';
import {mktempdir} from '@nlib/afs';
import {request} from './request';
import {listenPort} from './listen';
import {closeServers} from './closeServers';
import {PassThrough} from 'stream';

const test = anyTest as TestInterface<{
    directory: string,
    server: Server,
    baseURL: URL,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mktempdir();
    const server = t.context.server = createServer((req, res) => {
        const url = new URL(req.url || '', baseURL);
        t.log(`${req.method} ${url}`);
        if (url.pathname === '/redirect') {
            const step = parseInt(url.searchParams.get('step') || '0', 10);
            const status = 0 < step ? parseInt(url.searchParams.get('status') || '302', 10) : 200;
            const location = new URL(`${url}`);
            location.searchParams.set('status', `${status}`);
            location.searchParams.set('step', `${step - 1}`);
            const cookie = new Map(
                (req.headers.cookie || '').trim().split(/\s*;\s*/)
                .map((section) => section.split('=').slice(0, 2) as [string, string]),
            );
            const history = cookie.get('history');
            res.writeHead(status, {
                'location': `${location}`,
                'set-cookie': `history=${history ? `${history}-` : ''}${step}`,
            });
            res.end();
        } else {
            res.writeHead(200, {
                ...req.headers,
                path: req.url,
                method: req.method,
            });
            req.pipe(res);
        }
    });
    const baseURL = t.context.baseURL = new URL('http://localhost');
    baseURL.port = `${await listenPort(server)}`;
});

test.afterEach(async (t) => {
    await closeServers(t.context.server);
});

test('GET https://example.com/', async (t) => {
    const res = await request('https://example.com/');
    t.is(res.statusCode, 200);
});

test('POST http://localhost/foo (string)', async (t) => {
    const data = 'foobar';
    const url = new URL(`${t.context.baseURL}`);
    url.pathname = '/foo';
    url.searchParams.set('foo', 'bar');
    const res = await request(url, {method: 'POST'}, data);
    t.is(res.statusCode, 200);
    t.is(res.headers.path, '/foo?foo=bar');
    t.is(res.headers.method, 'POST');
    const loaded = await readStream(res);
    t.is(`${loaded}`, data);
});

test('POST http://localhost/foo (stream)', async (t) => {
    const data = 'foobar';
    const input = new PassThrough();
    setImmediate(() => {
        input.end(data);
    });
    const url = new URL(`${t.context.baseURL}`);
    url.pathname = '/foo';
    url.searchParams.set('foo', 'bar');
    const res = await request(url, {method: 'POST'}, input);
    t.is(res.statusCode, 200);
    t.is(res.headers.path, '/foo?foo=bar');
    t.is(res.headers.method, 'POST');
    const loaded = await readStream(res);
    t.is(`${loaded}`, data);
});

test('GET http://localhost/redirect?step=3 without cookie', async (t) => {
    const url = new URL('/redirect?step=3', `${t.context.baseURL}`);
    const res = await request(url, {resolveRedirection: {debug: true}});
    t.is(res.statusCode, 200);
    t.deepEqual(res.headers['set-cookie'], ['history=0']);
});

test('GET http://localhost/redirect?step=4 without cookie', async (t) => {
    const url = new URL('/redirect?step=4', `${t.context.baseURL}`);
    try {
        await request(url, {resolveRedirection: {debug: true}});
        t.fail();
    } catch (error) {
        t.is(error.code, 'TooManyRedirections');
    }
});

test('GET http://localhost/redirect?step=5 without cookie', async (t) => {
    const url = new URL('/redirect?step=5', `${t.context.baseURL}`);
    const res = await request(url, {resolveRedirection: {maxRedirections: 4, debug: true}});
    t.is(res.statusCode, 200);
    t.deepEqual(res.headers['set-cookie'], ['history=0']);
});

test('GET http://localhost/redirect?step=5 with cookie', async (t) => {
    const url = new URL('/redirect?step=5', `${t.context.baseURL}`);
    const res = await request(url, {
        resolveRedirection: {maxRedirections: 4, cookie: true, debug: true},
    });
    t.is(res.statusCode, 200);
    t.deepEqual(res.headers['set-cookie'], ['history=5-4-3-2-1-0']);
});
