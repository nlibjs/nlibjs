import {Promise, setTimeout, clearTimeout, Error} from '@nlib/global';
import {Server} from 'net';

export const closeServers = async (...servers: Array<Server>): Promise<void> => {
    await Promise.all(servers.map((server, index) => new Promise((resolve, reject) => {
        if (server.listening) {
            const timer = setTimeout(() => {
                reject(new Error(`The server#${index} failed to close`));
            }, 1000);
            server.close(() => {
                clearTimeout(timer);
                resolve();
            });
        } else {
            resolve();
        }
    })));
};
