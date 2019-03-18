import test from 'ava';
import * as index from './index';
import {traceAncestors} from './traceAncestors';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('index.traceAncestors', (t) => {
    t.is(index.traceAncestors, traceAncestors);
});

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
