import * as path from 'path';
import * as fs from 'fs';
import {URL} from 'url';
import test from 'ava';
import {
    packageDirectories,
    projectRootDirectory,
    rootPackageJSON,
} from './constants';
import {INlibJSPackageJSON} from './types';

export const getCategory = (directory: string) => directory.split(/[/\\]/).slice(-2)[0];
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

test('should have some packages', (t) => {
    t.true(0 < packageDirectories.length);
});

for (const packageDirectory of packageDirectories) {

    const relativeId = path.relative(projectRootDirectory, packageDirectory).split(path.sep).join('/');
    const titlePrefix = ['.', relativeId, 'package.json'].join(path.sep);
    const packageJSONPath = path.join(packageDirectory, 'package.json');
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8')) as INlibJSPackageJSON;

    test(`${titlePrefix} keys`, (t) => {
        const allowedKeys = new Set([
            'name',
            'version',
            'license',
            'author',
            'homepage',
            'repository',
            'publishConfig',
            'engines',
            'bin',
            'main',
            'files',
            'scripts',
            'dependencies',
            'devDependencies',
            'eslintConfig',
            'lint-staged',
        ]);
        const invalidKeys = Object.keys(packageJSON).filter((key) => !allowedKeys.has(key));
        t.is(
            invalidKeys.length,
            0,
            `${relativeId}/pacakge.json has invalid keys: ${invalidKeys.join(', ')}`,
        );
    });

    test(`${titlePrefix} name`, (t) => {
        t.is(packageJSON.name, `@nlib/${path.basename(relativeId)}`);
    });

    test(`${titlePrefix} license`, (t) => {
        t.is(packageJSON.license, rootPackageJSON.license);
    });

    test(`${titlePrefix} author`, (t) => {
        t.is(typeof packageJSON.author, 'object');
    });

    test(`${titlePrefix} author.name`, (t) => {
        t.is(typeof packageJSON.author.name, 'string');
    });

    test(`${titlePrefix} author.email`, (t) => {
        t.true((/[^\s@]+@[^\s@]+$/).test(packageJSON.author.email));
    });

    test(`${titlePrefix} author.url`, (t) => {
        if (packageJSON.author.url) {
            t.is(
                `${new URL(packageJSON.author.url)}`,
                packageJSON.author.url,
            );
        } else {
            t.pass();
        }
    });

    test(`${titlePrefix} homepage`, (t) => {
        t.is(
            packageJSON.homepage,
            `https://github.com/nlibjs/nlibjs/tree/master/${relativeId}`,
        );
    });

    test(`${titlePrefix} repository`, (t) => {
        t.is(
            packageJSON.repository,
            'https://github.com/nlibjs/nlibjs',
        );
    });

    test(`${titlePrefix} publishConfig`, (t) => {
        t.deepEqual(
            packageJSON.publishConfig,
            {access: 'public'},
        );
    });

    test(`${titlePrefix} main`, (t) => {
        t.is(packageJSON.main, 'lib/index.js');
    });

    test(`${titlePrefix} files`, (t) => {
        t.true(packageJSON.files.every((item) => typeof item === 'string'));
    });

    test(`${titlePrefix} scripts`, (t) => {
        t.is(packageJSON.scripts.precommit, 'lint-staged');
        t.is(packageJSON.scripts.prepack, 'node -e \'require(`@nlib/nlib-util`).prepack()\'');
    });

    test(`${titlePrefix} lint-staged`, (t) => {
        t.is(typeof packageJSON['lint-staged'], 'object');
    });

    const {dependencies} = packageJSON;
    if (dependencies) {
        const packageLevel = getPackageLevel(relativeId);
        test(`${titlePrefix} dependencies`, (t) => {
            t.is(typeof packageJSON.dependencies, 'object');
            const deps = {...dependencies};
            switch (relativeId) {
            case 'packages-core/xml-js':
                delete deps['xml-js'];
                break;
            case 'packages-node/afs':
                delete deps.semver;
                break;
            default:
            }
            for (const [name] of Object.entries(deps)) {
                const basename = name.startsWith('@nlib/') ? name.slice(6) : name;
                const directory = packageDirectories.find((directory) => directory.endsWith(basename));
                const dependencyLevel = getPackageLevel(directory);
                t.true(
                    dependencyLevel <= packageLevel,
                    `${relativeId} can't depend on ${name}`,
                );
            }
        });
    }

}
