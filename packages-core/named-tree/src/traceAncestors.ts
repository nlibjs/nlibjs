import {INamedTreeNode} from './types';
import {getNearestNode} from './getNearestNode';

export const traceAncestors = function* <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): IterableIterator<INamedTreeNode<TValue>> {
    let subtree: INamedTreeNode<TValue> | null | undefined = getNearestNode(tree, from);
    while (subtree) {
        yield subtree;
        subtree = subtree.parent;
    }
};
