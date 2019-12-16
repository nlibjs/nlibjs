import test from 'ava';
import {getNearestFilledNode} from './getNearestFilledNode';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

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
