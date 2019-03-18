import {
    INamedTreeNode,
} from './types';
import {getNearestFilledNode} from './getNearestFilledNode';

export const getNearestValue = <TValue>(
    tree: INamedTreeNode<TValue>,
    from: Iterable<string>,
): TValue | null => {
    const nearestFilledNode = getNearestFilledNode(tree, from);
    if (nearestFilledNode) {
        return nearestFilledNode.value;
    }
    return null;
};
