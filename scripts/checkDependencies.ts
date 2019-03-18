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

export const check = async (): Promise<void> => {
    const {core: corePackages} = await globPackages();
    let errorCount = 0;
    const allowedPackages = new Map(corePackages);
    for (const [name, {dependencies = {}}] of corePackages) {
        let errored = false;
        for (const dependency of Object.keys(dependencies)) {
            if (!isAllowedPackage(name, dependency, allowedPackages)) {
                errorCount++;
                errored = true;
                console.error(new NlibError({
                    code: 'EForbiddenPackage',
                    message: `${name} cannot depend on ${dependency}`,
                    data: dependency,
                }));
            }
        }
        if (!errored) {
            console.log(`✔︎ ${name}`);
        }
    }
    if (0 < errorCount) {
        throw new NlibError({
            code: '',
            message: `Error count: ${errorCount}`,
            data: errorCount,
        });
    }
};

if (!module.parent) {
    check().catch((error) => {
        console.log(error);
        process.exit();
    });
}
