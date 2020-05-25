import {
    Server,
    ListenOptions,
    Socket,
} from 'net';
import {
    SetZ,
    hasSetZ,
} from '@nlib/real-number';
import {
    CustomError,
    isString,
} from '@nlib/util';

export type Handle = Server | Socket | {fd: number};

export interface IListen {
    (server: Server, port?: number, hostname?: string, backlog?: number): Promise<Server>,
    (server: Server, port?: number, backlog?: number): Promise<Server>,
    (server: Server, pathOrHandle: string | Handle, backlog?: number): Promise<Server>,
    (server: Server, options: ListenOptions): Promise<Server>,
}

export const listen: IListen = (
    server: Server,
    arg1?: number | string | ListenOptions | Handle,
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
                throw new CustomError({
                    code: 'EInvalidParameter',
                    message: `Invalid second parameter: ${arg2}`,
                    data: arg2,
                });
            }
            break;
        default:
            throw new CustomError({
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
    hostname: string | null = null,
    backlog: number | null = null,
    validPortRange: SetZ = [[0x0000, 0xffff]],
): Promise<number> => {
    if (server.listening) {
        const addressInfo = server.address();
        if (isString(addressInfo)) {
            throw new CustomError({
                code: 'node-net/listenPort/1',
                message: `The server is listening ${addressInfo}`,
                data: addressInfo,
            });
        }
        if (!addressInfo) {
            throw new CustomError({
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
        if ((error as {code: string}).code === 'EADDRINUSE' && hasSetZ(validPortRange, port + 1)) {
            return await listenPort(server, port + 1, hostname, backlog, validPortRange);
        } else {
            throw error;
        }
    }
    return port;
};
