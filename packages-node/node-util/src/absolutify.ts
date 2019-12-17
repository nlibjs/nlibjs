import {PathLike} from 'fs';
import {isAbsolute, normalize, join} from 'path';

export const absolutify = (
    filePath: PathLike,
    baseDirectory = process.cwd(),
): string => {
    const stringified = `${filePath}`;
    if (isAbsolute(stringified)) {
        return normalize(stringified);
    } else {
        return join(baseDirectory, stringified);
    }
};
