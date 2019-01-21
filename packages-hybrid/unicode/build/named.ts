// http://unicode.org/reports/tr44/
import {join} from 'path';
import {Transform} from 'stream';
import {createWriteStream} from 'fs';
import {console} from '@nlib/global';
import {
    ScalarValueString,
    collectCodePointSequence,
    map,
    isASCIIAlphanumeric,
    CodePoint,
} from '@nlib/infra';
import {getUCDFieldsStream} from './getUCDFieldsStream';
import {urls} from './urls';

export const build = async (): Promise<void> => {
    const dest = join(__dirname, '../src/named.ts');
    const LESS_THAN_SIGN = 0x3C;
    const LOW_LINE = 0x5F as CodePoint;
    const stream = await getUCDFieldsStream(urls.UnicodeData);
    await new Promise<void>((resolve, reject) => {
        stream
        .pipe(new Transform({
            objectMode: true,
            transform([codePointWithoutPrefix, Name]: Array<ScalarValueString>, _, callback) {
                const name = collectCodePointSequence(Name, 0, (codePoint) => codePoint !== LESS_THAN_SIGN);
                if (0 < name.length) {
                    const filterdName = map(name, (codePoint) => isASCIIAlphanumeric(codePoint) ? codePoint : LOW_LINE);
                    this.push(Buffer.from(`export const ${filterdName} = 0x${codePointWithoutPrefix};\n`));
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
