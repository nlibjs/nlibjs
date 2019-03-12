// http://unicode.org/reports/tr44/
import {join} from 'path';
import {Transform} from 'stream';
import {createWriteStream} from 'fs';
import {console} from '@nlib/global';
import {
    collectCodePointSequence,
    isASCIIAlphanumeric,
    LOW_LINE,
    LESS_THAN_SIGN,
    toString,
} from '@nlib/infra';
import {getUCDFieldsStream} from './getUCDFieldsStream';
import {urls} from './urls';
import {getNameAliases} from './getNameAliases';

export const build = async (): Promise<void> => {
    const dest = join(__dirname, '../src/named.ts');
    const stream = await getUCDFieldsStream(urls.UnicodeData);
    const aliases = await getNameAliases();
    await new Promise<void>((resolve, reject) => {
        stream
        .pipe(new Transform({
            objectMode: true,
            transform([codePointWithoutPrefix, Name]: Array<Uint32Array>, _, callback) {
                let name: Uint32Array | undefined = collectCodePointSequence(
                    Name,
                    0,
                    (codePoint) => codePoint !== LESS_THAN_SIGN,
                );
                if (name.length === 0) {
                    name = aliases.get(`${codePointWithoutPrefix}`);
                }
                if (name && 0 < name.length) {
                    const filterdName = name.map((codePoint) => isASCIIAlphanumeric(codePoint) ? codePoint : LOW_LINE);
                    this.push(Buffer.from(`export const ${toString(filterdName)} = 0x${toString(codePointWithoutPrefix)};\n`));
                }
                callback();
            },
        }))
        .pipe(createWriteStream(dest))
        .once('error', reject)
        .once('finish', resolve);
    });
};

if (!module.parent) {
    build()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
