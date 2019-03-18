import {Number} from '@nlib/global';
import {NlibError} from './NlibError';
export const getLast = <TItem>(
    arrayLike: ArrayLike<TItem>,
    indexFromLast = -1,
): TItem => {
    if (indexFromLast < 0 && Number.isInteger(indexFromLast)) {
        const index = arrayLike.length + indexFromLast;
        if (index < 0) {
            throw new NlibError({
                code: 'EShort',
                message: `Cannot get the item at ${index}`,
                data: arrayLike,
            });
        }
        return arrayLike[index];
    }
    throw new NlibError({
        code: 'EInvalidIndex',
        message: `The second argument should be a negative integer: ${indexFromLast}`,
        data: indexFromLast,
    });
};
