// http://unicode.org/reports/tr44/
import {join} from 'path';
import {Transform} from 'stream';
import {
    Map,
    Promise as $Promise,
} from '@nlib/global';
import {toString} from '@nlib/infra';
import {createWriteStream} from 'fs';
import {getUCDFieldsStream} from './getUCDFieldsStream';
import {urls} from './urls';

export type AliaseMap = Map<string, Uint32Array>;

export const getNameAliases = async (): Promise<AliaseMap> => {
    const dest = join(__dirname, '../src/named.ts');
    const stream = await getUCDFieldsStream(urls.NameAliases);
    const aliases: AliaseMap = new Map();
    await new $Promise<void>((resolve, reject) => {
        stream
        .pipe(new Transform({
            objectMode: true,
            transform([codePointWithoutPrefix, Name, type]: Array<Uint32Array>, _, callback) {
                if (toString(type) !== 'abbreviation') {
                    const key = toString(codePointWithoutPrefix);
                    if (!aliases.has(key)) {
                        aliases.set(key, Name);
                    }
                }
                callback();
            },
        }))
        .pipe(createWriteStream(dest))
        .once('error', reject)
        .once('finish', resolve);
    });
    return aliases;
};
