import anyTest, {TestInterface} from 'ava';
// import {httpGet} from '@nlib/node-net';
// import {readStream} from '@nlib/node-stream';
// import {xml2js, Element, elementWalker} from '@nlib/xml-js';
// import {elementToRecord} from './elementToRecord';
import {REGISTERED_TYPES} from './REGISTERED_TYPES';
import {IRecord} from './types';
import * as index from './index';

const test = anyTest as TestInterface<{
    records: Array<IRecord>,
}>;

// test.before(async (t) => {
//     const res = await httpGet('https://www.iana.org/assignments/media-types/media-types.xml');
//     const xmlString = await readStream(res);
//     const xml = xml2js(`${xmlString}`, {compact: false}) as Element;
//     const records: Array<IRecord> = t.context.records = [];
//     for (const [element] of elementWalker(xml)) {
//         const record = elementToRecord(element);
//         if (record) {
//             records.push(record);
//         }
//     }
// });

// test('should have all registered types', (t) => {
//     for (const record of t.context.records) {
//         t.true(REGISTERED_TYPES.has(record.type));
//         const map = REGISTERED_TYPES.get(record.type);
//         t.truthy(map);
//         if (map) {
//             t.true(map.has(record.subtype));
//             t.truthy(map.get(record.subtype));
//         }
//     }
// });

test('index.REGISTERED_TYPES', (t) => {
    t.is(index.REGISTERED_TYPES, REGISTERED_TYPES);
});
