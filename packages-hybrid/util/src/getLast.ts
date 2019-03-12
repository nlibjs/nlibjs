import {Error} from '@nlib/global';
export const getLast = <TItem>(arrayLike: ArrayLike<TItem>): TItem => {
    const {length} = arrayLike;
    if (length === 0) {
        throw new Error('Cannot get the last item: arrayLike.length is 0.');
    }
    return arrayLike[length - 1];
};
