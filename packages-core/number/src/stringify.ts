import {Number, TypeError} from '@nlib/global';

export const stringify = (value: number): string => {
    if (Number.isFinite(value)) {
        return value.toString();
    }
    if (0 < value) {
        return 'Infinity';
    }
    if (value < 0) {
        return '-Infinity';
    }
    throw new TypeError(`The given value is not a number: ${value}`);
};
