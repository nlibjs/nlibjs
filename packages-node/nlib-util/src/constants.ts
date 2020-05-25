import * as path from 'path';
import * as fs from 'fs';
import {INlibJSLernaJSON, INlibJSRootPackageJSON} from './types';
import * as fg from 'fast-glob';

export const projectRootDirectory = path.join(__dirname, '../../..');

export const lernaJSONPath = path.join(projectRootDirectory, 'lerna.json');
export const lernaJSON = JSON.parse(fs.readFileSync(lernaJSONPath, 'utf8')) as INlibJSLernaJSON;

export const rootPackageJSONPath = path.join(projectRootDirectory, 'package.json');
export const rootPackageJSON = JSON.parse(fs.readFileSync(rootPackageJSONPath, 'utf8')) as INlibJSRootPackageJSON;

export const packageDirectoryPatterns = lernaJSON.packages.map((pattern) => {
    return path.join(projectRootDirectory, pattern).split(path.sep).join('/');
});
export const packageDirectories = fg.sync(
    packageDirectoryPatterns,
    {onlyDirectories: true},
).sort((a, b) => a.localeCompare(b));
