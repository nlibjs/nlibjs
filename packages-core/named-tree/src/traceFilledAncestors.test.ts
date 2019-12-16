import test from 'ava';
import {traceFilledAncestors} from './traceFilledAncestors';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('traceFilledAncestors', (t) => {
    const tree = createEmptyRootNode<string>();
    const filledFooBar = setValue(tree, ['foo', 'bar'], 'a');
    const filledFoo = setValue(tree, ['foo'], 'b');
    const actual = [...traceFilledAncestors(tree, ['foo', 'bar', 'baz'])];
    t.deepEqual(
        actual,
        [
            filledFooBar,
            filledFoo,
        ],
    );
});
