import test from 'ava';
import * as index from './index';
import {getNearestFilledNode} from './getNearestFilledNode';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('index.getNearestFilledNode', (t) => {
    t.is(index.getNearestFilledNode, getNearestFilledNode);
});

test('getNearestFilledNode', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    t.deepEqual(
        getNearestFilledNode(tree, ['foo', 'bar', 'baz']),
        filledBar,
    );
    t.deepEqual(
        getNearestFilledNode(tree, ['foo', 'bar']),
        filledBar,
    );
    t.deepEqual(
        getNearestFilledNode(tree, ['foo']),
        filledFoo,
    );
});
