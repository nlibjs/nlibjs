import test from 'ava';
import {traceAncestorValues} from './traceAncestorValues';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('traceAncestorValues', (t) => {
    const tree = createEmptyRootNode<string>();
    setValue(tree, ['foo', 'bar'], 'a');
    setValue(tree, ['foo'], 'b');
    const actual = [...traceAncestorValues(tree, ['foo', 'bar', 'baz'])];
    t.deepEqual(
        actual,
        [
            'a',
            'b',
        ],
    );
});
