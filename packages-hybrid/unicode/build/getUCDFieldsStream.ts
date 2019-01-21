import {join} from 'path';
import {Readable} from 'stream';
import {httpGet} from '@nlib/node-util';
import {LineStream} from '@nlib/node-stream';
import {FieldExtractor} from './FieldExtractor';

export const getUCDFieldsStream = async (url: string | URL): Promise<Readable> => {
    const cacheDirectory = join(__dirname, '__cache');
    return (await httpGet(url, cacheDirectory))
    .pipe(new LineStream('utf8'))
    .pipe(new FieldExtractor());
};
