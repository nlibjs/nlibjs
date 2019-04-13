import * as path from 'path';
import * as fs from 'fs';
import globby from 'globby';
import * as lerna from '../lerna.json';

export interface IPackageData {
    name: string,
    version: string,
    license: string,
    author: string,
    homepage: string,
    repository: string,
    publishConfig: {
        access: string,
    },
    engines: {
        node: string,
    },
    main: string,
    files: Array<string>,
    scripts: {
        [name: string]: string,
    },
    dependencies: {
        [name: string]: string,
    },
}

export const projectRoot = path.dirname(__dirname);
export const packageList = globby.sync(lerna.packages.map((pattern) => path.join(
    path.isAbsolute(pattern) ? pattern : path.join(projectRoot, pattern),
    'package.json',
)))
.sort()
.map((packageJSONPath) => {
    const fullPath = path.dirname(packageJSONPath);
    const group = path.basename(path.dirname(fullPath));
    const name = `@nlib/${path.basename(fullPath)}`;
    return {
        fullPath,
        group,
        name,
        data: JSON.parse(fs.readFileSync(packageJSONPath, 'utf8')) as IPackageData,
        tsconfig: fs.readFileSync(path.join(fullPath, 'tsconfig.json'), 'utf8'),
    };
});

if (packageList.length === 0) {
    throw new Error(`Failed to list project.json: ${JSON.stringify(lerna.packages)}`);
}
