import test from 'ava';
import {xml2js, Element} from 'xml-js';
import {getTextContent} from './getTextContent';
import * as index from './index';

test('index.getTextContent', (t) => {
    t.true('getTextContent' in index);
});

test('getTextContent', (t) => {
    const xml = xml2js(`
        <?xml version='1.1' encoding='utf-8'?>
        <b>foo <a>bar </a> baz</b>
    `, {compact: false}) as Element;
    const actual = getTextContent(xml);
    t.is(actual, 'foo bar  baz');
});
