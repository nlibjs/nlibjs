import {Map} from '@nlib/global';
import {mediatype} from './types';

export const parse = (input: string): mediatype.ISource => {
    return {
        type: input,
        subtype: '',
        parameters: new Map(),
    };
};
