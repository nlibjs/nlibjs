import test from 'ava';
import * as _xmljs from 'xml-js';
import * as xmljs from './index';

const {
    js2xml,
    json2xml,
    xml2js,
    xml2json,
} = _xmljs;

const exportedKeys = [
    'js2xml',
    'json2xml',
    'xml2js',
    'xml2json',
];

test('should be a superset of xml-js', (t) => {
    t.deepEqual(exportedKeys.sort(), Object.keys(_xmljs).sort());
    t.is(js2xml, xmljs.js2xml);
    t.is(json2xml, xmljs.json2xml);
    t.is(xml2js, xmljs.xml2js);
    t.is(xml2json, xmljs.xml2json);
});
