import * as path from 'path';
import {promises as afs} from 'fs';
import {removeSourceMap} from './removeSourceMap';

const execute = async (
    input?: string,
) => {
    if (input) {
        const directory = path.isAbsolute(input) ? input : path.join(process.cwd(), input);
        const stats = await afs.stat(directory);
        if (stats.isDirectory()) {
            return await removeSourceMap(directory);
        } else {
            throw new Error(`NonDirectory:${input}`);
        }
    }
    throw new Error(`InvalidDirectory:${input}`);
};

if (!module.parent) {
    execute(process.argv.slice(2, -1).reverse()[0])
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
