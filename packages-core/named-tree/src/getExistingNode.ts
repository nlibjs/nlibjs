import {INamedTreeNode} from './types';

export const getExistingNode = <TValue>(
    tree: INamedTreeNode<TValue>,
    path: Iterable<string>,
): INamedTreeNode<TValue> | null => {
    let subtree: INamedTreeNode<TValue> | undefined = tree;
    for (const key of path) {
        subtree = subtree.get(key);
        if (!subtree) {
            return null;
        }
    }
    return subtree;
};
