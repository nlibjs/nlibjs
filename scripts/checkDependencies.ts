import {join, sep} from 'path';
import {readFile} from '../packages-node/afs/lib';
const glob: (pattern: string, cb: (err: Error | null, matches: Array<string>) => void) => void = require('glob');
type DataValue = string | {[key: string]: string};
interface IData {
    name: string,
    dependencies: {
        [packageName: string]: string,
    },
    [key: string]: DataValue,
}

export const check = (pattern: string): Promise<void> => new Promise<Array<string>>((resolve, reject) => {
    glob(pattern, (error, files) => {
        if (error) {
            reject(error);
        } else {
            resolve(files);
        }
    });
})
.then(async (files: Array<string>) => {
    const packages = await Promise.all(files.map(async (file) => {
        const [category, directory] = file.split(sep).slice(-3, -1);
        return {
            category,
            directory,
            ...JSON.parse(`${await readFile(file)}`) as IData,
        };
    }));
    const hybridPackages = new Set<string>();
    for (const {category, name} of packages) {
        if (category === 'packages-hybrid') {
            hybridPackages.add(name);
        }
    }
    let errorCount = 0;
    for (const {name, dependencies} of packages) {
        let errored = false;
        if ((hybridPackages.has(name) || name === '@nlib/node-util') && dependencies) {
            const forbiddenPackages = Object.keys(dependencies)
            .filter((packageName) => packageName.startsWith('@nlib') && !hybridPackages.has(packageName));
            if (0 < forbiddenPackages.length) {
                errorCount++;
                errored = true;
                console.error(new Error(`${name} cannot depend on ${forbiddenPackages.join(', ')}`));
            }
        }
        if (!errored) {
            console.log(`✔︎ ${name}`);
        }
    }
    if (0 < errorCount) {
        throw new Error(`Error count: ${errorCount}`);
    }
});

if (!module.parent) {
    check(join(__dirname, '../packages-*/*/package.json'))
    .catch((error) => {
        console.log(error);
        process.exit();
    });
}
