// http://unicode.org/reports/tr44/
import {join} from 'path';
import {Transform} from 'stream';
import {createWriteStream} from 'fs';
import {Map} from '@nlib/global';
import {ScalarValueString} from '@nlib/infra';
import {getUCDFieldsStream} from './getUCDFieldsStream';
import {urls} from './urls';

export type AliaseMap = Map<string, ScalarValueString>;

export const getNameAliases = async (): Promise<AliaseMap> => {
    const dest = join(__dirname, '../src/named.ts');
    const stream = await getUCDFieldsStream(urls.NameAliases);
    const aliases: AliaseMap = new Map();
    await new Promise<void>((resolve, reject) => {
        stream
        .pipe(new Transform({
            objectMode: true,
            transform([codePointWithoutPrefix, Name, type]: Array<ScalarValueString>, _, callback) {
                if (`${type}` !== 'abbreviation') {
                    aliases.set(`${codePointWithoutPrefix}`, Name);
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
