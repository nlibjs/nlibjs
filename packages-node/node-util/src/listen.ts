import {Promise, Error} from '@nlib/global';
import {fromIntervalZ, inin, ZSet} from '@nlib/real-number';
import {Server, ListenOptions} from 'net';

export function listen(server: Server, port?: number, hostname?: string, backlog?: number): Promise<Server>;
export function listen(server: Server, port?: number, hostname?: string): Promise<Server>;
export function listen(server: Server, port?: number, backlog?: number): Promise<Server>;
export function listen(server: Server, port?: number): Promise<Server>;
export function listen(server: Server, path: string, backlog?: number): Promise<Server>;
export function listen(server: Server, path: string): Promise<Server>;
export function listen(server: Server, options: ListenOptions): Promise<Server>;
export function listen(server: Server, handle: {}, backlog?: number): Promise<Server>;
export function listen(server: Server, handle: {}): Promise<Server>;
export function listen(
    server: Server,
    arg1?: number | string | ListenOptions | {},
    arg2?: string | number,
    arg3?: number,
): Promise<Server> {
    return new Promise((resolve, reject) => {
        if (server.listening) {
            resolve(server);
        } else {
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
            case 'object':
                switch (typeof arg2) {
                case 'number':
                case 'undefined':
                    server.listen(arg1, arg2);
                    break;
                default:
                    throw new Error(`Invalid second parameter: ${arg2}`);
                }
                break;
            default:
                throw new Error(`Invalid first parameter: ${arg1}`);
            }
        }
    });
}

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
