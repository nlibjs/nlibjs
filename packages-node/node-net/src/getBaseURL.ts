import {URL} from 'url';
import * as net from 'net';

export const getBaseURL = (
    addressInfo: net.AddressInfo,
    protocol = 'http:',
): URL => {
    if (typeof addressInfo === 'object') {
        const {port, family, address} = addressInfo;
        return new URL(`${protocol}//${family === 'IPv6' ? `[${address}]` : address}:${port}`);
    }
    throw new Error(`Unsupported addressInfo: ${addressInfo}`);
};
