import {Object} from '@nlib/global';
import {INamedTreeNode} from './types';
import {createEmptyNode} from './createNode';
import {isFilled} from './isFilled';

export const getOrSetDefaultValue = <TValue>(
    tree: INamedTreeNode<TValue>,
    path: Iterable<string>,
    defaultValueGetter: () => TValue,
): TValue => {
    let subtree: INamedTreeNode<TValue> = tree;
    for (const key of path) {
        let child = subtree.get(key);
        if (!child) {
            child = createEmptyNode(subtree, key);
            subtree.set(key, child);
        }
        subtree = child;
    }
    if (isFilled(subtree)) {
        return subtree.value;
    }
    const value = defaultValueGetter();
    Object.assign(subtree, {value});
    return value;
};
