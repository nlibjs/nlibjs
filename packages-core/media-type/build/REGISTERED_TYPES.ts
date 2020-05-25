import {join} from 'path';
import {Set} from '@nlib/global';
import {readStream} from '@nlib/node-stream';
import {xml2js, Element, elementWalker} from '@nlib/xml-js';
import {updateFile} from '@nlib/afs';
import {elementToRecord} from '../src/elementToRecord';
import {getFileStream} from './getFileStream';
import {IRecord} from '../src/types';

export const build = async (): Promise<void> => {
    const url = 'https://www.iana.org/assignments/media-types/media-types.xml';
    const res = await getFileStream(url);
    const xmlString = await readStream(res);
    const xml = xml2js(`${xmlString}`, {compact: false}) as Element;
    const records: Array<IRecord> = [];
    const typeSet: Set<string> = new Set();
    for (const [element] of elementWalker(xml)) {
        const record = elementToRecord(element);
        if (record) {
            records.push(record);
            typeSet.add(record.type);
        }
    }
    const types = [...typeSet];
    const lines = [
        'import {Map} from \'@nlib/global\';',
        'export const REGISTERED_TYPES = new Map<string, Map<string, string>>();',
    ];
    for (const type of types) {
        lines.push(`const ${type} = new Map<string, string>();`);
        lines.push(`REGISTERED_TYPES.set('${type}', ${type});`);
        for (const record of records) {
            if (record.type === type) {
                lines.push(`${type}.set('${record.subtype}', '${record.name}');`);
            }
        }
    }
    lines.push('');
    const code: string = lines.join('\n');
    const dest = join(__dirname, '../src/REGISTERED_TYPES.ts');
    await updateFile(dest, code);
};

if (!module.parent) {
    build()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
