import * as path from 'path';
import test from 'ava';
import {
    packageDirectories,
    rootPackageJSON,
} from './constants';

export const getCategory = (directory: string) => directory.split(path.sep).slice(-2)[0];
export const getPackageLevel = (directory: string | undefined) => {
    if (directory) {
        const level = [
            'packages-core',
            'packages-node',
        ].indexOf(getCategory(directory));
        if (0 <= level) {
            return level;
        }
    }
    return Infinity;
};

test('commitlint', (t) => {
    t.deepEqual(
        rootPackageJSON.commitlint.rules['scope-enum'][2],
        packageDirectories.map((packageDirectory) => path.basename(packageDirectory)).concat('deps', 'repo'),
    );
});

test('rootPackage.json#private', (t) => {
    t.is(rootPackageJSON.private, true);
});

test('rootPackage.json#license', (t) => {
    t.is(typeof rootPackageJSON.license, 'string');
});
