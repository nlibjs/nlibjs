import test from 'ava';
import {walkFilledNodes} from './walkFilledNodes';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('walkFilledNodes', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledFooBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    const filledBar = setValue(tree, ['bar'], 'b');
    const actual = [...walkFilledNodes(tree)];
    t.deepEqual(
        actual,
        [
            filledFoo,
            filledFooBar,
            filledBar,
        ],
    );
});
