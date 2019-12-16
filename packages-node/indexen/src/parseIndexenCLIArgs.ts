import * as path from 'path';
import {IConfiguration} from './types';
import {defaultConfigurations} from './defaultConfigurations';

export const parseIndexenCLIArgs = (
    argv: Array<string>,
    cwd = process.cwd(),
): IConfiguration => {
    const args = argv.slice();
    const options: Partial<IConfiguration> = {};
    {
        const destIndex = args.indexOf('--dest');
        if (0 <= destIndex) {
            const [, dest] = args.splice(destIndex, 2);
            if (dest) {
                options.dest = path.isAbsolute(dest) ? dest : path.join(cwd, dest);
            } else {
                throw new Error(`InvalidDest:${dest}`);
            }
        }
    }
    if (args.length !== 1) {
        throw new Error(`InvalidArgument:${argv.join(' ')}`);
    }
    const directory = args.shift();
    if (directory) {
        return {
            ...defaultConfigurations,
            ...options,
            directory: path.isAbsolute(directory) ? directory : path.join(cwd, directory),
        };
    } else {
        throw new Error(`InvalidDirectory:${directory}`);
    }
};
