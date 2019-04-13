import test from 'ava';
import {packageList, IPackageData} from './constants';

const getAllowedDependencies = (
    group: string,
    name: string,
): Set<string> => {
    const allowedDependencies = new Set<string>();
    for (const {name} of packageList.filter(({group}) => group === 'packages-core')) {
        allowedDependencies.add(name);
    }
    if (group === 'packages-node') {
        for (const {name} of packageList.filter(({group}) => group === 'packages-node')) {
            allowedDependencies.add(name);
        }
    }
    switch (name) {
    case '@nlib/global':
        allowedDependencies.add('@types/webassembly-js-api');
        break;
    case '@nlib/xml-js':
        allowedDependencies.add('xml-js');
        break;
    case '@nlib/afs':
        allowedDependencies.add('semver');
        allowedDependencies.add('@types/semver');
        break;
    default:
    }
    return allowedDependencies;
};

test('package.json keys', (t) => {
    const optionalKeys = new Set([
        'dependencies',
        'devDependencies',
        'eslintConfig',
    ]);
    const getKeys = (data: IPackageData): Array<string> => Object.keys(data)
    .filter((key) => !optionalKeys.has(key));
    packageList.reduce((p1, p2) => {
        const getMessage = (
            key: string,
        ) => `${key} of ${p1.group}/${p1.name} and ${p2.group}/${p2.name} are not same.`;
        const d1 = p1.data;
        const d2 = p2.data;
        t.deepEqual(getKeys(d1), getKeys(d2), getMessage('keys'));
        t.is(d1.author, d2.author, getMessage('author'));
        t.is(d1.license, d2.license, getMessage('license'));
        t.is(d1.repository, d2.repository, getMessage('repository'));
        t.deepEqual(d1.publishConfig, d2.publishConfig, getMessage('publishConfig'));
        t.deepEqual(d1.engines, d2.engines, getMessage('engines'));
        t.is(d1.main, d2.main, getMessage('main'));
        t.is(p1.tsconfig, p2.tsconfig, getMessage('tsconfig'));
        return p2;
    });
});

for (const {group, name, data} of packageList) {
    test(`${group}/${name}: package data`, (t) => {
        t.is(data.name, name);
        const allowedDependencies = getAllowedDependencies(group, name);
        if (data.dependencies) {
            for (const dependency of Object.keys(data.dependencies)) {
                t.true(
                    allowedDependencies.has(dependency),
                    `${dependency} is not allowed for ${name}`,
                );
            }
        }
    });
}
