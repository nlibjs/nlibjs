import test from 'ava';
import {getNearestNode} from './getNearestNode';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';
import {getExistingNode} from './getExistingNode';

test('getNearestNode', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    t.deepEqual(
        getNearestNode(tree, ['foo', 'bar', 'baz']),
        filledBar,
    );
    t.deepEqual(
        getNearestNode(tree, ['foo', 'bar']),
        getExistingNode(tree, ['foo', 'bar']),
    );
    t.deepEqual(
        getNearestNode(tree, ['foo']),
        filledFoo,
    );
});
