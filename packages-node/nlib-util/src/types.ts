import * as ESLint from 'eslint';

export type INlibJSConfigYMLJobStep =
| 'checkout'
| {restore_cache: {keys: Array<string>}}
| {save_cache: {paths: Array<string>, key: string}}
| {persist_to_workspace: {root: string, paths: Array<string>}}
| {attach_workspace: {at: string}}
| {run: string};

export interface INlibJSConfigYMLJob {
    docker: Array<{image: string}>,
    steps: Array<INlibJSConfigYMLJobStep>,
}

export type INlibJSConfigYMLWorkflowJobFilter = {only: string} | {ignore: string};

export interface INlibJSConfigYMLWorkflowJob {
    filters?: {
        branches?: INlibJSConfigYMLWorkflowJobFilter,
        tags?: INlibJSConfigYMLWorkflowJobFilter,
    },
    requires: Array<string>,
}

export interface INlibJSConfigYMLWorkflow {
    jobs: Array<{[name: string]: INlibJSConfigYMLWorkflowJob | undefined}>,
}

export interface INlibJSCircleCIConfig {
    version: string,
    jobs: {
        [name: string]: INlibJSConfigYMLJob | undefined,
    },
    workflows: {
        [name: string]: INlibJSConfigYMLWorkflow | number | undefined,
    },
}

export interface INlibJSTravisCIConfig {
    language: string,
    cache: {
        directories: Array<string>,
    },
    os: Array<string>,
    node_js: Array<string>,
    install: Array<string>,
    script: Array<string>,
    before_install?: Array<string>,
    after_install?: Array<string>,
}

export interface INlibJSLernaJSON {
    version: string,
    packages: Array<string>,
    npmClient: 'npm' | 'yarn',
    command?: {
        publish?: {
            allowBranch?: string,
            ignoreChanges?: Array<string>,
            message?: string,
        },
        bootstrap?: {
            ignore?: string,
            npmClientArgs?: Array<string>,
            scope?: Array<string>,
        },
    },
}

export interface IPerson {
    name: string,
    email: string,
    url: string,
}

export interface IPublishConfig {
    access: 'public',
}

export interface IEngines {
    [name: string]: string | undefined,
}

export interface IScripts {
    [command: string]: string | undefined,
}

export interface IDependencies {
    [name: string]: string | undefined,
}

export interface INlibJSPackageJSON {
    name: string,
    version: string,
    license: string,
    author: IPerson,
    contributors?: Array<IPerson>,
    homepage: string,
    repository: string,
    publishConfig: IPublishConfig,
    engines: IEngines,
    main: string,
    files: Array<string>,
    scripts: IScripts,
    dependencies: IDependencies,
    devDependencies: IDependencies,
}

export interface INlibJSRootPackageJSON {
    private: true,
    license: string,
    scripts: IScripts,
    devDependencies: IDependencies,
    eslintConfig: ESLint.Linter.Config & {
        extends: Array<string>,
        overrides: Array<ESLint.Linter.Config & {files: Array<string>}>,
    },
    ava: {},
    commitlint: {
        extends: Array<string>,
        rules: {
            'scope-enum': [
                number,
                string,
                Array<string>,
            ],
        },
    },
    husky: {},
    'renovate-config': {},
}

export interface IPackageTestParameters {
    lernaProjectDirectory: string,
    lernaJSON: INlibJSLernaJSON,
    rootPackageJSON: INlibJSRootPackageJSON,
    packageDirectory: string,
    packageJSON: INlibJSPackageJSON,
}
