import {NlibError} from '@nlib/util';
import {Server} from 'net';

export const closeServers = async (...servers: Array<Server>): Promise<void> => {
    await Promise.all(servers.map(async (server, index) => {
        await new Promise((resolve, reject) => {
            if (server.listening) {
                const timer = setTimeout(() => {
                    reject(new NlibError({
                        code: 'node-net/closeServers/1',
                        message: `The server#${index} failed to close`,
                        data: {servers},
                    }));
                }, 1000);
                server.close(() => {
                    clearTimeout(timer);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }));
};
