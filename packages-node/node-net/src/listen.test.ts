import anyTest, {TestInterface} from 'ava';
import {createServer, Server} from 'net';
import {listenPort, listen} from './listen';
import * as index from './index';
import {closeServers} from './closeServers';

const test = anyTest as TestInterface<{
    servers: Array<Server>,
    createServer: () => Server,
}>;

test.beforeEach((t) => {
    t.context.servers = [];
    t.context.createServer = () => {
        const server = createServer();
        t.context.servers.push(server);
        return server;
    };
});

test.afterEach(async (t) => {
    await closeServers(...t.context.servers);
});

test('index.listen', (t) => {
    t.is(index.listen, listen);
});

test('listen 5000', async (t) => {
    const server = t.context.createServer();
    const port = 5000;
    await listen(server, port);
    t.true(server.listening);
});

test('listen 6000 and backlog', async (t) => {
    const server = t.context.createServer();
    const port = 6000;
    await listen(server, port, 5);
    t.true(server.listening);
});

test('listenPort', async (t) => {
    const server = t.context.createServer();
    const listeningPort1 = await listenPort(server);
    t.true(server.listening);
    t.true(4000 <= listeningPort1);
    const listeningPort2 = await listenPort(server, listeningPort1);
    t.true(server.listening);
    t.is(listeningPort1, listeningPort2);
});

test('pass listenOptions', async (t) => {
    const server = t.context.createServer();
    await listen(server, {port: 3000});
    t.true(server.listening);
});

test('skip listen() if server.running', async (t) => {
    const server = t.context.createServer();
    await listenPort(server);
    t.true(server.listening);
    const address1 = server.address();
    await listen(server, {port: 4001});
    const address2 = server.address();
    t.deepEqual(address1, address2);
});

test('try the next port', async (t) => {
    const server1 = t.context.createServer();
    const server2 = t.context.createServer();
    const listeningPort1 = await listenPort(server1);
    t.true(4000 <= listeningPort1);
    const listeningPort2 = await listenPort(server2);
    t.true(listeningPort1 !== listeningPort2);
});
