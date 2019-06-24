import anyTest, {TestInterface} from 'ava';
import {join} from 'path';
import {readFile} from 'fs';
import {Linter} from 'eslint';
import {rules as availableTypeScriptRules} from '@typescript-eslint/eslint-plugin';

interface IESLintConfig extends Linter.Config {
    overrides: Array<Linter.Config>,
}

const test = anyTest as TestInterface<{
    config: IESLintConfig,
}>;

test.beforeEach(async (t) => {
    const json: string = await new Promise((resolve, reject) => {
        const packageJson = join(__dirname, '..', '.eslintrc.json');
        readFile(packageJson, 'utf8', (error, string) => {
            if (error) {
                reject(error);
            } else {
                resolve(string);
            }
        });
    });
    t.context.config = JSON.parse(json);
});

test('should be valid configuration', (t) => {
    const linter = new Linter();
    t.truthy(linter.verify('', t.context.config));
});

{
    const availableESLintRules = new Linter().getRules();
    for (const [ruleName] of availableESLintRules) {
        test(`should cover "${ruleName}"`, (t) => {
            const {rules = {}} = t.context.config;
            t.truthy(rules[ruleName], `${ruleName} is not covered`);
        });
    }
    test('should have supported rules', (t) => {
        for (const rule of Object.keys(t.context.config.rules || {})) {
            t.true(availableESLintRules.has(rule), `${rule} is not supported`);
        }
    });
}

{
    const prefix = '@typescript-eslint';
    const availableTypeScriptRuleNames = new Set(Object.keys(availableTypeScriptRules).map((name) => `${prefix}/${name}`));
    // https://github.com/typescript-eslint/typescript-eslint/issues/101
    const rulesToBeIgnored = new Set<string>([
        '@typescript-eslint/await-thenable',
        '@typescript-eslint/no-floating-promises',
        '@typescript-eslint/no-for-in-array',
        '@typescript-eslint/no-unnecessary-qualifier',
        '@typescript-eslint/no-unnecessary-type-assertion',
        '@typescript-eslint/prefer-includes',
        '@typescript-eslint/prefer-regexp-exec',
        '@typescript-eslint/prefer-string-starts-ends-with',
        '@typescript-eslint/promise-function-async',
        '@typescript-eslint/require-array-sort-compare',
        '@typescript-eslint/restrict-plus-operands',
        '@typescript-eslint/unbound-method',
    ]);
    for (const ruleName of availableTypeScriptRuleNames) {
        if (rulesToBeIgnored.has(ruleName)) {
            test(`should ignore "${ruleName}"`, (t) => {
                const typescriptConfig = t.context.config.overrides
                .find((override) => override.parser === `${prefix}/parser`);
                if (!typescriptConfig) {
                    t.truthy(typescriptConfig);
                    return;
                }
                const {rules = {}} = typescriptConfig;
                const config = rules[ruleName];
                t.falsy(config, `${ruleName} should be ignored`);
            });
        } else {
            test(`should cover "${ruleName}"`, (t) => {
                const typescriptConfig = t.context.config.overrides
                .find((override) => override.parser === `${prefix}/parser`);
                if (!typescriptConfig) {
                    t.truthy(typescriptConfig);
                    return;
                }
                const {rules = {}} = typescriptConfig;
                const config = rules[ruleName];
                t.truthy(config, `${ruleName} is not covered`);
            });
        }
    }
    test('should have supported typescript-eslint rules', (t) => {
        const typescriptConfig = t.context.config.overrides
        .find((override) => override.parser === `${prefix}/parser`);
        if (!typescriptConfig) {
            t.truthy(typescriptConfig);
            return;
        }
        const {rules = {}} = typescriptConfig;
        for (const rule of Object.keys(rules).filter((name) => name.startsWith(prefix))) {
            t.true(availableTypeScriptRuleNames.has(rule), `${rule} is not supported`);
        }
    });
}
