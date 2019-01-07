import {get as getHTTP, ServerResponse} from 'http';
import {get as getHTTPS} from 'https';
export const httpGet = (src: string | URL): Promise<ServerResponse> => new Promise((resolve, reject) => {
    const url = new URL(`${src}`);
    const get = url.protocol === 'https:' ? getHTTPS : getHTTP;
    get(url)
    .once('error', reject)
    .once('response', resolve);
});
