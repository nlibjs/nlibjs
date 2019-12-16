import test from 'ava';
import {getNearestValue} from './getNearestValue';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('getNearestValue', (t) => {
    const tree = createEmptyRootNode<string>();
    setValue(tree, ['foo', 'bar'], 'a');
    setValue(tree, ['foo'], 'b');
    t.deepEqual(
        getNearestValue(tree, ['foo', 'bar', 'baz']),
        'a',
    );
    t.deepEqual(
        getNearestValue(tree, ['foo', 'bar']),
        'a',
    );
    t.deepEqual(
        getNearestValue(tree, ['foo']),
        'b',
    );
});
