import {join, sep} from 'path';
import {readFile} from '../packages-node/afs/src';
import {NlibError} from '../packages-core/util/src/NlibError';
export type DataValue = string | {[key: string]: string};
export interface IData {
    readonly name: string,
    readonly dependencies: {
        [packageName: string]: string,
    },
    readonly [key: string]: DataValue,
}
export interface IPackages {
    readonly core: Map<string, IData>,
    readonly node: Map<string, IData>,
}
export const glob: (pattern: string, cb: (err: Error | null, matches: Array<string>) => void) => void = require('glob');
export const globAsync = (pattern: string): Promise<Array<string>> => new Promise((resolve, reject) => {
    glob(pattern, (error, files) => {
        if (error) {
            reject(error);
        } else {
            resolve(files);
        }
    });
});
export const globPackages = async (): Promise<IPackages> => {
    const core = new Map<string, IData>();
    const node = new Map<string, IData>();
    await Promise.all(
        (await globAsync(join(__dirname, '../packages-*/*/package.json')))
        .map(async (file) => {
            const [category, directory] = file.split(sep).slice(-3, -1);
            const data: IData = JSON.parse(`${await readFile(file)}`);
            if (!data.name.endsWith(directory)) {
                throw new NlibError({
                    code: 'EUnmatchName',
                    message: `The package's name "${data.name}" doesn't ends with "${directory}"`,
                    data: file,
                });
            }
            switch (category) {
            case 'packages-core':
                core.set(data.name, data);
                break;
            case 'packages-node':
                node.set(data.name, data);
                break;
            default:
                throw new NlibError({
                    code: 'EUnknownCategory',
                    message: `Unknown category: ${category}`,
                    data: category,
                });
            }
        })
    );
    return {core, node};
};
