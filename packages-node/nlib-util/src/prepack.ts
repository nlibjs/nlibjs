import * as path from 'path';
import * as fg from 'fast-glob';
import * as afs from '@nlib/afs';
import {removeSourceMap} from '@nlib/remove-sourcemap';

export const removeTestFiles = async (): Promise<void> => {
    const pattern = path.join(process.cwd(), 'lib/**/*.test{.js,.js.map,.d.ts}');
    const files = await fg(pattern);
    await Promise.all(files.map(async (file) => {
        await afs.unlink(file);
        console.log(`Deleted: ${file}`);
    }));
};

export const prepack = async (): Promise<void> => {
    try {
        await removeTestFiles();
        await removeSourceMap(path.join(process.cwd(), 'lib'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
