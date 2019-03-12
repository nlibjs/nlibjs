import {SetR} from './types';
import {normalizeSetR} from './normalize';

export const unionSetR = (...sets: Array<SetR>): SetR => {
    const concatenated: SetR = [];
    let length = 0;
    while (1) {
        let set = sets.shift();
        if (!set) {
            break;
        }
        set = set.slice();
        while (1) {
            const interval = set.shift();
            if (!interval) {
                break;
            }
            concatenated[length++] = interval;
        }
    }
    return normalizeSetR(concatenated);
};
