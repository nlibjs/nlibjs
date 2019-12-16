import test from 'ava';
import {getExistingValue} from './getExistingValue';
import {setValue} from './setValue';
import {createEmptyRootNode} from './createNode';

test('getExistingValue depth:0', (t) => {
    const tree = createEmptyRootNode();
    setValue(tree, [], 'foo');
    t.is(getExistingValue(tree, []), 'foo');
});

test('getExistingValue depth:1', (t) => {
    const tree = createEmptyRootNode();
    setValue(tree, ['bar'], 'foo');
    t.is(getExistingValue(tree, ['bar']), 'foo');
});

test('getExistingValue depth:2', (t) => {
    const tree = createEmptyRootNode();
    setValue(tree, ['bar', 'baz'], 'foo');
    t.is(getExistingValue(tree, ['bar', 'baz']), 'foo');
});
