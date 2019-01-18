import {ScalarValueString} from './types';
import {getCodePoints} from './getCodePoints';

export const toScalaValueString = (input: string | ScalarValueString): ScalarValueString => {
    if (typeof input === 'string') {
        return [...getCodePoints(input)];
    }
    return input.slice();
};
