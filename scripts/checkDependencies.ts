import {NlibError} from '../packages-core/util/src/NlibError';
import {
    globPackages,
    IData,
} from './util';

export const allowedExternalPackages = new Map<string, Set<string>>([
    ['@nlib/global', new Set([
        '@types/webassembly-js-api',
    ])],
    ['@nlib/xml-js', new Set([
        'xml-js',
    ])],
    ['@nlib/afs', new Set([
        'semver',
        '@types/semver',
    ])],
]);

export const isAllowedPackage = (
    packageName: string,
    dependency: string,
    allowedPackages: Map<string, IData>,
): boolean => {
    if (allowedPackages.has(dependency)) {
        return true;
    }
    const set = allowedExternalPackages.get(packageName);
    if (set && set.has(dependency)) {
        return true;
    }
    return false;
};

export const checkDependencies = (
    {
        name,
        dependencies = {},
    }: IData,
    allowedPackages: Map<string, IData>,
): Array<NlibError<string>> => {
    const errors: Array<NlibError<string>> = [];
    for (const dependency of Object.keys(dependencies)) {
        if (!isAllowedPackage(name, dependency, allowedPackages)) {
            errors.push(new NlibError({
                code: 'EForbiddenPackage',
                message: `${name} cannot depend on ${dependency}`,
                data: dependency,
            }));
        }
    }
    console.log(`${errors.length === 0 ? '✔' : '×'} ${name}`);
    if (0 < errors.length) {
        for (const error of errors) {
            console.log(`  - ${error.message}`);
        }
    }
    return errors;
};

export const check = async (): Promise<void> => {
    const {
        core: corePackages,
        node: nodePackages,
    } = await globPackages();
    const errors: Array<NlibError<string>> = [];
    const allowedPackages = new Map(corePackages);
    for (const [, packageData] of corePackages) {
        errors.push(...checkDependencies(packageData, allowedPackages));
    }
    for (const [name, packageData] of nodePackages) {
        allowedPackages.set(name, packageData);
    }
    for (const [, packageData] of nodePackages) {
        errors.push(...checkDependencies(packageData, allowedPackages));
    }
    if (0 < errors.length) {
        throw new NlibError({
            code: '',
            message: `Detected ${errors.length} error(s).`,
            data: errors.length,
        });
    }
};

if (!module.parent) {
    check().catch((error) => {
        console.log(error.stack || error);
        process.exit();
    });
}
