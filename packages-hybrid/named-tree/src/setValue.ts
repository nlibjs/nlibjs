import {Object} from '@nlib/global';
import {
    INamedTreeNode,
    IFilledNamedTreeNode,
} from './types';
import {createEmptyNode} from './createNode';

export const setValue = <TValue>(
    tree: INamedTreeNode<TValue>,
    path: Iterable<string>,
    value: TValue,
): IFilledNamedTreeNode<TValue> => {
    let subtree: INamedTreeNode<TValue> = tree;
    for (const key of path) {
        let child = subtree.get(key);
        if (!child) {
            child = createEmptyNode(subtree, key);
            subtree.set(key, child);
        }
        subtree = child;
    }
    return Object.assign(subtree, {value});
};
