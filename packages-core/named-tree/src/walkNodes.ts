import {INamedTreeNode} from './types';

export const walkNodes = function* <TValue>(
    tree: INamedTreeNode<TValue>,
): IterableIterator<INamedTreeNode<TValue>> {
    yield tree;
    for (const [, child] of tree) {
        yield* walkNodes(child);
    }
};
