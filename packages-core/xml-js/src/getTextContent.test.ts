import test from 'ava';
import {xml2js, Element} from 'xml-js';
import {getTextContent} from './getTextContent';

test('getTextContent', (t) => {
    const xml = xml2js(`
        <?xml version='1.1' encoding='utf-8'?>
        <b>foo <a>bar </a> baz</b>
    `, {compact: false}) as Element;
    const actual = getTextContent(xml);
    t.is(actual, 'foo bar  baz');
});
