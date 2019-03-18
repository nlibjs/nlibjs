import {INamedTreeNode} from './types';
import {isFilled} from './isFilled';
import {getExistingNode} from './getExistingNode';

export const getExistingValue = <TValue>(
    tree: INamedTreeNode<TValue>,
    path: Iterable<string>,
): TValue | null => {
    const existingNode = getExistingNode(tree, path);
    if (existingNode && isFilled(existingNode)) {
        return existingNode.value;
    }
    return null;
};
