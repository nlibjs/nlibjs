import {Map} from '@nlib/global';
import {mediatype} from './types';

export const parse = (input: string): mediatype.Source => {
    return {
        type: '',
        subtype: '',
        parameters: new Map(),
    };
};
