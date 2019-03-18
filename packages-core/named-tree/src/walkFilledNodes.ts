import {
    INamedTreeNode,
    IFilledNamedTreeNode,
} from './types';
import {walkNodes} from './walkNodes';
import {isFilled} from './isFilled';

export const walkFilledNodes = function* <TValue>(
    tree: INamedTreeNode<TValue>,
): IterableIterator<IFilledNamedTreeNode<TValue>> {
    for (const node of walkNodes(tree)) {
        if (isFilled(node)) {
            yield node;
        }
    }
};
