import test from 'ava';
import {walkNodes} from './walkNodes';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('walkNodes', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledFooBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    const filledBar = setValue(tree, ['bar'], 'b');
    const actual = [...walkNodes(tree)];
    t.deepEqual(
        actual,
        [
            tree,
            filledFoo,
            filledFooBar,
            filledBar,
        ],
    );
});
