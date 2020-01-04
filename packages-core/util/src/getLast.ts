import {Number} from '@nlib/global';
import {CustomError} from './CustomError';

export const getLast = <TItem>(
    arrayLike: ArrayLike<TItem>,
    indexFromLast = -1,
): TItem => {
    if (indexFromLast < 0 && Number.isInteger(indexFromLast)) {
        const index = arrayLike.length + indexFromLast;
        if (index < 0) {
            throw new CustomError({
                code: 'EShort',
                message: `Cannot get the item at ${index}`,
                data: arrayLike,
            });
        }
        return arrayLike[index];
    }
    throw new CustomError({
        code: 'EInvalidIndex',
        message: `The second argument should be a negative integer: ${indexFromLast}`,
        data: indexFromLast,
    });
};
