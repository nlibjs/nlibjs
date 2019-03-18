import {
    Object,
    Map,
} from '@nlib/global';
import {
    INamedTreeNode, IFilledNamedTreeNode, IEmptyNamedTreeNode,
} from './types';

export const createNode = <TValue>(
    parent: INamedTreeNode<TValue>,
    name: string,
    value: TValue,
): IFilledNamedTreeNode<TValue> => Object.assign(new Map(), {
    parent,
    name,
    value,
});

export const createEmptyNode = <TValue>(
    parent: INamedTreeNode<TValue>,
    name: string,
): IEmptyNamedTreeNode<TValue> => Object.assign(new Map(), {
    parent,
    name,
});

export const createRootNode = <TValue>(
    name: string = '',
    value: TValue,
): IFilledNamedTreeNode<TValue> => Object.assign(new Map(), {
    parent: null,
    name,
    value,
});

export const createEmptyRootNode = <TValue>(
    name: string = '',
): IEmptyNamedTreeNode<TValue> => Object.assign(new Map(), {
    parent: null,
    name,
});
