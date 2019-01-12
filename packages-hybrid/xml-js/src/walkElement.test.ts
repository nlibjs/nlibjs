import test from 'ava';
import {xml2js, Element} from 'xml-js';
import {walkElement} from './walkElement';
import * as index from './index';

test('index.walkElement', (t) => {
    t.true('walkElement' in index);
});

test('walkElement', (t) => {
    const xml = xml2js(`
        <?xml version='1.1' encoding='utf-8'?>
        <b><a></a></b>
    `, {compact: false}) as Element;
    const actual: Array<Array<Element>> = [];
    walkElement(xml, (...ancestors) => {
        actual.push(ancestors);
    });
    const a = {type: 'element', name: 'a'};
    const b = {type: 'element', name: 'b', elements: [a]};
    const root = {
        declaration: {attributes: {version: '1.1', encoding: 'utf-8'}},
        elements: [b],
    };
    t.deepEqual(actual, [
        [root],
        [b, root],
        [a, b, root],
    ]);
});

test('stop walking', (t) => {
    const xml = xml2js(`
        <?xml version='1.1' encoding='utf-8'?>
        <b><a></a></b>
    `, {compact: false}) as Element;
    const actual: Array<Array<Element>> = [];
    walkElement(xml, (element, ...ancestors) => {
        actual.push([element, ...ancestors]);
        return element.name === 'b';
    });
    const a = {type: 'element', name: 'a'};
    const b = {type: 'element', name: 'b', elements: [a]};
    const root = {
        declaration: {attributes: {version: '1.1', encoding: 'utf-8'}},
        elements: [b],
    };
    t.deepEqual(actual, [
        [root],
        [b, root],
    ]);
});
