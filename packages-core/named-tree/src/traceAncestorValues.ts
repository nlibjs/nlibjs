import {INamedTreeNode} from './types';
import {isFilled} from './isFilled';
import {getNearestFilledNode} from './getNearestFilledNode';

export const traceAncestorValues = function* <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): IterableIterator<TValue> {
    let subtree: INamedTreeNode<TValue> | null | undefined = getNearestFilledNode(tree, from);
    while (subtree) {
        if (isFilled(subtree)) {
            yield subtree.value;
        }
        subtree = subtree.parent;
    }
};
