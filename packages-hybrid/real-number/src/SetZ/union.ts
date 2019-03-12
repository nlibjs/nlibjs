import {SetZ} from './types';
import {normalizeSetZ} from './normalize';

export const unionSetZ = (...sets: Array<SetZ>): SetZ => {
    const concatenated: SetZ = [];
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
    return normalizeSetZ(concatenated);
};
