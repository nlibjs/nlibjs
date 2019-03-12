import {
    INamedTreeNode,
} from './types';

export const getNearestNode = <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): INamedTreeNode<TValue> | null => {
    let subtree: INamedTreeNode<TValue> | undefined | null = tree;
    for (const key of from) {
        const child: INamedTreeNode<TValue> | undefined = subtree.get(key);
        if (!child) {
            break;
        }
        subtree = child;
    }
    return subtree;
};
