import {
    INamedTreeNode,
} from './types';
import {walkFilledNodes} from './walkFilledNodes';

export const walkValues = function* <TValue>(
    tree: INamedTreeNode<TValue>,
): IterableIterator<TValue> {
    for (const node of walkFilledNodes(tree)) {
        yield node.value;
    }
};
