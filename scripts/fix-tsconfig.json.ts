import {join} from 'path';
import {readFile, updateFile} from '../packages-node/afs/lib';
const glob: (pattern: string, cb: (err: Error | null, matches: Array<string>) => void) => void = require('glob');
type DataValue = string | {[key: string]: string};
type DataArray = Array<[string, DataValue]>;
type DataMap = Map<string, DataValue>;

export const fix = async (file: string): Promise<void> => {
    const map: DataMap = new Map(Object.entries(JSON.parse(`${await readFile(file)}`)));
    const keys = [
        'extends',
        'compilerOptions',
        'include',
    ];
    for (const [key] of map) {
        if (!keys.includes(key)) {
            throw new Error(`Unknown key: ${key}`);
        }
    }
    const defaults: DataMap = new Map([
    ] as DataArray);
    const overwrites: DataMap = new Map([
        ['extends', '../../tsconfig.json'],
        ['compilerOptions', {
            outDir: './lib',
        }],
        ['include', ['src/**/*.ts']],
    ] as DataArray);
    const result: {[key: string]: string | {}} = {};
    for (const key of keys) {
        const value = overwrites.get(key) || map.get(key) || defaults.get(key);
        if (typeof value !== 'undefined') {
            result[key] = value;
        }
    }
    await updateFile(file, `${JSON.stringify(result, null, 4)}\n`);
};

export const forEachFile = (
    pattern: string,
    fn: (file: string) => Promise<void>,
): Promise<void> => new Promise<Array<string>>((resolve, reject) => {
    glob(pattern, (error, files) => {
        if (error) {
            reject(error);
        } else {
            resolve(files);
        }
    });
})
.then(async (files: Array<string>) => {
    await Promise.all(files.map(fn));
});

if (!module.parent) {
    forEachFile(join(__dirname, '../packages-*/*/tsconfig.json'), fix)
    .catch((error) => {
        console.log(error);
        process.exit();
    });
}
