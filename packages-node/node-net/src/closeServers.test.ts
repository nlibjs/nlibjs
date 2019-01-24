import test from 'ava';
import {Server, createServer} from 'net';
import {closeServers} from './closeServers';
import {listenPort} from './listen';

test('close inactive servers', async (t) => {
    const servers: Array<Server> = [];
    const N = 5;
    while (servers.length < N) {
        servers.push(createServer());
    }
    await closeServers(...servers);
    t.pass();
});

test('close active servers', async (t) => {
    const servers: Array<Server> = [];
    const N = 5;
    while (servers.length < N) {
        servers.push(createServer());
    }
    for (const server of servers) {
        await listenPort(server);
    }
    await closeServers(...servers);
    t.pass();
});

test('close no server', async (t) => {
    await closeServers();
    t.pass();
});
