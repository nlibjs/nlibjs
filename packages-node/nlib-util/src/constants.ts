import * as path from 'path';
import * as fs from 'fs';
import {INlibJSLernaJSON, INlibJSRootPackageJSON} from './types';
import * as globby from 'globby';

export const projectRootDirectory = path.join(__dirname, '../../..');

export const lernaJSONPath = path.join(projectRootDirectory, 'lerna.json');
export const lernaJSON: INlibJSLernaJSON = JSON.parse(fs.readFileSync(lernaJSONPath, 'utf8'));

export const rootPackageJSONPath = path.join(projectRootDirectory, 'package.json');
export const rootPackageJSON: INlibJSRootPackageJSON = JSON.parse(fs.readFileSync(rootPackageJSONPath, 'utf8'));

export const packageDirectoryPatterns = lernaJSON.packages.map((pattern) => {
    return path.join(projectRootDirectory, pattern).split(path.sep).join('/');
});
export const packageDirectories = globby.sync(
    packageDirectoryPatterns,
    {onlyDirectories: true},
).sort((a, b) => a.localeCompare(b));
