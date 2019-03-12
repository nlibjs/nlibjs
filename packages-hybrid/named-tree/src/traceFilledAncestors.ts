import {INamedTreeNode, IFilledNamedTreeNode} from './types';
import {isFilled} from './isFilled';
import {getNearestFilledNode} from './getNearestFilledNode';

export const traceFilledAncestors = function* <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): IterableIterator<IFilledNamedTreeNode<TValue>> {
    let subtree: INamedTreeNode<TValue> | null | undefined = getNearestFilledNode(tree, from);
    while (subtree) {
        if (isFilled(subtree)) {
            yield subtree;
        }
        subtree = subtree.parent;
    }
};
