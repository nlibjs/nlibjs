import * as path from 'path';
import * as globby from 'globby';
import * as afs from '@nlib/afs';

export const removeTestFiles = async (): Promise<void> => {
    const pattern = path.join(process.cwd(), 'lib/**/*.test{.js,.js.map,.d.ts}');
    const files = await globby(pattern);
    await Promise.all(files.map(async (file) => {
        await afs.unlink(file);
        console.log(`Deleted: ${file}`);
    }));
};

export const prepack = (): Promise<void> => Promise.all([
    removeTestFiles(),
])
.then(() => {})
.catch((error) => {
    console.error(error);
    process.exit(1);
});
