import {
    IFilledNamedTreeNode,
    INamedTreeNode,
} from './types';

export const isFilled = <TValue>(tree: INamedTreeNode<TValue>): tree is IFilledNamedTreeNode<TValue> => 'value' in tree;
