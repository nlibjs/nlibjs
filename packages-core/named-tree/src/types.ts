export interface IEmptyNamedTreeNode<TValue> extends Map<string, INamedTreeNode<TValue>> {
    parent: INamedTreeNode<TValue> | null,
    name: string,
}

export interface IFilledNamedTreeNode<TValue> extends Map<string, INamedTreeNode<TValue>> {
    parent: INamedTreeNode<TValue> | null,
    name: string,
    value: TValue,
}

export type INamedTreeNode<TValue> = IEmptyNamedTreeNode<TValue> | IFilledNamedTreeNode<TValue>;
