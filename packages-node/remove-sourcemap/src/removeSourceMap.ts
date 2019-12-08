import {promises as afs} from 'fs';
import {removeSourceMapLines} from './removeSourceMapLines';
import {IPatternList} from './types';
import {processFilesInDirectory} from './processFilesInDirectory';

export const removeSourceMap = async (
    directory: string,
    {
        filter = ['.js', '.css'],
        remove = ['.js.map', '.css.map'],
    }: {
        filter?: IPatternList,
        remove?: IPatternList,
    } = {},
) => await processFilesInDirectory(directory, [
    {
        name: 'remove sourcemap lines',
        pattern: filter,
        process: async (filePath) => await afs.writeFile(
            filePath,
            removeSourceMapLines(await afs.readFile(filePath, 'utf8')),
        ),
    },
    {
        name: 'delete sourcemap files',
        pattern: remove,
        process: async (filePath) => await afs.unlink(filePath),
    },
]);
