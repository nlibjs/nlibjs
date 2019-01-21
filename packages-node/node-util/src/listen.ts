import {Promise, Error} from '@nlib/global';
import {fromIntervalZ, inin, ZSet} from '@nlib/real-number';
import {Server, ListenOptions} from 'net';

type ListenParams =
| [number]
| [number, number]
| [number, string]
| [number, string, number]
| [string]
| [string, number]
| [ListenOptions];

export const listen = (server: Server, ...args: ListenParams): Promise<Server> => new Promise((resolve, reject) => {
    if (server.listening) {
        resolve(server);
    } else {
        const [arg1, arg2, arg3] = args;
        server
        .once('error', reject)
        .once('listening', () => {
            server.removeListener('error', reject);
            resolve(server);
        });
        switch (typeof arg1) {
        case 'number':
            switch (typeof arg2) {
            case 'number':
                server.listen(arg1, arg2);
                break;
            default:
                server.listen(arg1, arg2, arg3);
            }
            break;
        case 'string':
            switch (typeof arg2) {
            case 'number':
                server.listen(arg1, arg2);
                break;
            default:
                throw new Error(`Invalid second parameter: ${arg2}`);
            }
            break;
        case 'object':
            server.listen(arg1);
            break;
        default:
            throw new Error(`Invalid first parameter: ${arg1}`);
        }
    }
});

export const listenPort = async (
    server: Server,
    port: number = 4000,
    hostname?: string,
    backlog?: number,
    validPortRange: ZSet = fromIntervalZ(inin(0x0000, 0xffff)),
): Promise<number> => {
    if (server.listening) {
        const addressInfo = server.address();
        if (typeof addressInfo === 'string') {
            throw new Error(`The server listens a port: ${addressInfo}`);
        }
        return addressInfo.port;
    }
    try {
        if (hostname) {
            if (backlog) {
                await listen(server, port, hostname, backlog);
            } else {
                await listen(server, port, hostname);
            }
        } else if (backlog) {
            await listen(server, port, backlog);
        } else {
            await listen(server, port);
        }
    } catch (error) {
        if (error.code === 'EADDRINUSE' && validPortRange.has(port + 1)) {
            return listenPort(server, port + 1, hostname, backlog, validPortRange);
        } else {
            throw error;
        }
    }
    return port;
};