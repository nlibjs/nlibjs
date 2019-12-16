import * as path from 'path';
import * as stream from 'stream';
import {httpGet} from '@nlib/node-net';
import {LineStream} from '@nlib/node-stream';
import {FieldExtractor} from './FieldExtractor';

export const getUCDFieldsStream = async (
    url: string | URL,
): Promise<stream.Readable> => {
    const cacheDirectory = path.join(__dirname, '__cache');
    return (await httpGet(url, cacheDirectory))
    .pipe(new LineStream('utf8'))
    .pipe(new FieldExtractor());
};
