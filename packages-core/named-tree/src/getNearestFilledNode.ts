import {
    INamedTreeNode,
    IFilledNamedTreeNode,
} from './types';
import {isFilled} from './isFilled';

export const getNearestFilledNode = <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): IFilledNamedTreeNode<TValue> | null => {
    let subtree: INamedTreeNode<TValue> | undefined | null = tree;
    for (const key of from) {
        const child: INamedTreeNode<TValue> | undefined = subtree.get(key);
        if (!child) {
            break;
        }
        subtree = child;
    }
    while (subtree) {
        if (isFilled(subtree)) {
            return subtree;
        }
        subtree = subtree.parent;
    }
    return null;
};
