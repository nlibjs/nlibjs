import {join} from 'path';
import {httpGet, readStream} from '@nlib/node-util';
import {xml2js, Element, elementWalker} from '@nlib/xml-js';
import {updateFile} from '@nlib/afs';
import {mediatype} from '../src/types';
import {elementToRecord} from '../src/elementToRecord';

export const build = async (): Promise<void> => {
    const res = await httpGet('https://www.iana.org/assignments/media-types/media-types.xml');
    const xmlString = await readStream(res);
    const xml = xml2js(`${xmlString}`, {compact: false}) as Element;
    const records: Array<mediatype.IRecord> = [];
    const typeSet: Set<string> = new Set();
    for (const [element] of elementWalker(xml)) {
        const record = elementToRecord(element);
        if (record) {
            records.push(record);
            typeSet.add(record.type);
        }
    }
    const types = [...typeSet];
    const code: string = [
        'import {Map} from \'@nlib/global\';',
        'export const REGISTERED_TYPES: Map<string, Map<string, string>> = new Map([',
        ...types.map((type) => {
            const matchedRecords = records.filter((record) => record.type === type);
            return [
                `    ['${type}', new Map([`,
                ...matchedRecords.map(({name, subtype}) => `        ['${subtype}', '${name}'],`),
                '    ])],',
            ].join('\n');
        }),
        ']);',
        '',
    ].join('\n');
    const dest = join(__dirname, '../src/constants.ts');
    await updateFile(dest, code);
};

if (!module.parent) {
    build()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
