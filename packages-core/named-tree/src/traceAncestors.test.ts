import test from 'ava';
import {traceAncestors} from './traceAncestors';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('traceAncestors', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledFooBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    const actual = [...traceAncestors(tree, ['foo', 'bar', 'baz'])];
    t.deepEqual(
        actual,
        [
            filledFooBar,
            filledFoo,
            tree,
        ],
    );
});
