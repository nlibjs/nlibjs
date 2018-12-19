import {PathLike} from 'fs';
import {isAbsolute, normalize, join} from 'path';

export const absolutify = (file: PathLike, base = process.cwd()): string => {
    const stringified = `${file}`;
    return isAbsolute(stringified) ? normalize(stringified) : join(base, stringified);
};
