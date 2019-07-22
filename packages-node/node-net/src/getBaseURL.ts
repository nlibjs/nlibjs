import {URL} from 'url';
import * as net from 'net';

export const getBaseURL = (
    addressInfo: string | net.AddressInfo | null,
    protocol = 'http:',
): URL => {
    if (addressInfo && typeof addressInfo === 'object') {
        const {port, family, address} = addressInfo;
        return new URL(`${protocol}//${family === 'IPv6' ? `[${address}]` : address}:${port}`);
    }
    throw new Error(`Unsupported addressInfo: ${addressInfo}`);
};
