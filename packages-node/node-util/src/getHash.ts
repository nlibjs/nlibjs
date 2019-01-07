import {Hash, createHash, HexBase64Latin1Encoding} from 'crypto';

export interface HashOptions {
    algorithm: string
    encoding: HexBase64Latin1Encoding | typeof Buffer
}

export const getHash = (
    data: Parameters<Hash['update']>[0],
    {algorithm, encoding}: HashOptions = {algorithm: 'sha256', encoding: 'latin1'},
): string | Buffer => {
    const hash = createHash(algorithm);
    hash.update(data);
    return encoding === Buffer ? hash.digest() : hash.digest(encoding as HexBase64Latin1Encoding);
};
