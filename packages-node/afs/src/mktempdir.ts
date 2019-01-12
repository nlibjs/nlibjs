import {tmpdir} from 'os';
import {join} from 'path';
import {mkdtemp, realpath} from './core';
export const mktempdir = async (prefix: string = 'temp'): Promise<string> => {
    return realpath(await mkdtemp(join(tmpdir(), `${prefix}-`)));
};
