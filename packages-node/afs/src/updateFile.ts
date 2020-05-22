import {writeFilep} from './writeFilep';
import {readFile} from './core';
import {isENOENT} from './isError';

export const updateFile = async (...args: Parameters<typeof writeFilep>): ReturnType<typeof writeFilep> => {
    const data = Buffer.from(args[1]);
    const currentData = await readFile(args[0])
    .catch((error) => {
        if (isENOENT(error)) {
            return Buffer.from('');
        }
        throw error;
    });
    if (data.equals(currentData)) {
        return;
    }
    await writeFilep(...args);
};
