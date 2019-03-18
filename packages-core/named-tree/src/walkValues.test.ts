import test from 'ava';
import * as index from './index';
import {walkValues} from './walkValues';
import {createEmptyRootNode} from './createNode';
import {setValue} from './setValue';

test('index.walkValues', (t) => {
    t.is(index.walkValues, walkValues);
});

test('walkValues', (t) => {
    const tree = createEmptyRootNode<string>();
    setValue(tree, ['foo', 'bar'], 'a');
    setValue(tree, ['foo'], 'b');
    setValue(tree, ['bar'], 'c');
    const actual = [...walkValues(tree)];
    t.deepEqual(
        actual,
        [
            'b',
            'a',
            'c',
        ],
    );
});
