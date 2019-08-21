import {
    Server,
    ListenOptions,
} from 'net';
import {
    SetZ,
    hasSetZ,
} from '@nlib/real-number';
import {
    NlibError,
    isString,
} from '@nlib/util';

export interface IListen {
    (server: Server, port?: number, hostname?: string, backlog?: number): Promise<Server>,
    (server: Server, port?: number, backlog?: number): Promise<Server>,
    (server: Server, pathOrHandle: string | {}, backlog?: number): Promise<Server>,
    (server: Server, options: ListenOptions): Promise<Server>,
}

export const listen: IListen = (
    server: Server,
    arg1?: number | string | ListenOptions | {},
    arg2?: string | number,
    arg3?: number,
): Promise<Server> => new Promise((resolve, reject) => {
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
                throw new NlibError({
                    code: 'EInvalidParameter',
                    message: `Invalid second parameter: ${arg2}`,
                    data: arg2,
                });
            }
            break;
        default:
            throw new NlibError({
                code: 'EInvalidParameter',
                message: `Invalid first parameter: ${arg1}`,
                data: arg1,
            });
        }
    }
});

export const listenPort = async (
    server: Server,
    port = 4000,
    hostname?: string,
    backlog?: number,
    validPortRange: SetZ = [[0x0000, 0xffff]],
): Promise<number> => {
    if (server.listening) {
        const addressInfo = server.address();
        if (isString(addressInfo)) {
            throw new NlibError({
                code: 'node-net/listenPort/1',
                message: `The server is listening ${addressInfo}`,
                data: addressInfo,
            });
        }
        if (!addressInfo) {
            throw new NlibError({
                code: 'node-net/listenPort/2',
                message: `server.address() returns ${addressInfo}`,
                data: addressInfo,
            });
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
        if (error.code === 'EADDRINUSE' && hasSetZ(validPortRange, port + 1)) {
            return listenPort(server, port + 1, hostname, backlog, validPortRange);
        } else {
            throw error;
        }
    }
    return port;
};
