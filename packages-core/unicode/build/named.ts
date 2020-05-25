// http://unicode.org/reports/tr44/
import * as path from 'path';
import * as stream from 'stream';
import * as fs from 'fs';
import {console, Promise} from '@nlib/global';
import {
    collectCodePointSequence,
    isASCIIAlphanumeric,
    LOW_LINE,
    LESS_THAN_SIGN,
    toString,
} from '@nlib/infra';
import {getUCDFieldsStream} from './getUCDFieldsStream';
import {getNameAliases} from './getNameAliases';
import {urls} from './urls';

export const build = async (): Promise<void> => {
    const dest = path.join(__dirname, '../src/named.ts');
    const ucdFieldsStream = await getUCDFieldsStream(urls.UnicodeData);
    const aliases = await getNameAliases();
    await new Promise<void>((resolve, reject) => {
        ucdFieldsStream
        .pipe(new stream.Transform({
            objectMode: true,
            transform([codePointWithoutPrefix, Name]: Array<Uint32Array>, _, callback) {
                const codePoint = parseInt(`0x${toString(codePointWithoutPrefix)}`, 16);
                if (codePoint < 0x00F0) {
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
                } else {
                    this.push(null);
                }
                callback();
            },
        }))
        .pipe(fs.createWriteStream(dest))
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
