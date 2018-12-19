import {Hash, createHash} from 'crypto';

export const getHash = (data: Parameters<Hash['update']>[0]): string => {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('base64');
};
