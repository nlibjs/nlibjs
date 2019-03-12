import test from 'ava';
import * as index from './index';
import {setValue} from './setValue';
import {
    createNode,
    createEmptyRootNode,
} from './createNode';

test('index.setValue', (t) => {
    t.is(index.setValue, setValue);
});

test('setValue depth:0', (t) => {
    const tree = createEmptyRootNode();
    const filled = setValue(tree, [], 'foo');
    t.is(tree, filled);
    t.is(filled.value, 'foo');
});

test('setValue depth:1', (t) => {
    const tree = createEmptyRootNode();
    const filled = setValue(tree, ['bar'], 'foo');
    t.not(tree, filled);
    t.is(tree.size, 1);
    t.deepEqual(
        tree.get('bar'),
        createNode(tree, 'bar', 'foo'),
    );
});

test('setValue depth:2', (t) => {
    const tree = createEmptyRootNode();
    const filled = setValue(tree, ['bar', 'baz'], 'foo');
    t.not(tree, filled);
    t.is(tree.size, 1);
    const bar = tree.get('bar');
    if (bar) {
        t.is(bar.size, 1);
        t.deepEqual(
            bar.get('baz'),
            createNode(bar, 'baz', 'foo'),
        );
    } else {
        t.truthy(bar);
    }
});
