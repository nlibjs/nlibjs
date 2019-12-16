import test from 'ava';
import {getOrSetDefaultValue} from './getOrSetDefaultValue';
import {INamedTreeNode} from './types';
import {getExistingValue} from './getExistingValue';
import {createEmptyRootNode} from './createNode';

test('getOrSetDefaultValue depth:0', (t) => {
    const tree: INamedTreeNode<string> = createEmptyRootNode();
    t.is(getOrSetDefaultValue(tree, [], () => 'foo'), 'foo');
    t.is(getOrSetDefaultValue(tree, [], () => 'foofoo'), 'foo');
    t.is(getExistingValue(tree, []), 'foo');
});

test('getOrSetDefaultValue depth:1', (t) => {
    const tree: INamedTreeNode<string> = createEmptyRootNode();
    t.is(getOrSetDefaultValue(tree, ['bar'], () => 'foo'), 'foo');
    t.is(getOrSetDefaultValue(tree, ['bar'], () => 'foofoo'), 'foo');
    t.is(getExistingValue(tree, ['bar']), 'foo');
});

test('getOrSetDefaultValue depth:2', (t) => {
    const tree: INamedTreeNode<string> = createEmptyRootNode();
    t.is(getOrSetDefaultValue(tree, ['bar', 'baz'], () => 'foo'), 'foo');
    t.is(getOrSetDefaultValue(tree, ['bar', 'baz'], () => 'foofoo'), 'foo');
    t.is(getExistingValue(tree, ['bar', 'baz']), 'foo');
});
