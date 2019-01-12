import {Array} from '@nlib/global';
export type ConcatenateeItem<TItem> = TItem | Array<TItem> | ReadonlyArray<TItem>;
export type Concatenatee<TItem> = Array<ConcatenateeItem<TItem>> | ReadonlyArray<ConcatenateeItem<TItem>>;
export const concat = <TItem>(args: Array<TItem | Array<TItem>>): Array<TItem> => {
    const result: Array<TItem> = [];
    for (const arg of args) {
        if (Array.isArray(arg)) {
            result.push(...arg as Array<TItem>);
        } else {
            result.push(arg);
        }
    }
    return result;
};
