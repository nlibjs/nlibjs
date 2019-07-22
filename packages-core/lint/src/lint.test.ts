import anyTest, {TestInterface, ExecutionContext} from 'ava';
import * as path from 'path';
import * as fs from 'fs';
import * as eslint from 'eslint';
import * as eslintPlugin from '@typescript-eslint/eslint-plugin';

interface IESLintConfig extends eslint.Linter.Config {
    overrides: Array<eslint.Linter.Config>,
}

interface ITextContext {
    config: IESLintConfig,
}

const test = anyTest as TestInterface<ITextContext>;

test.beforeEach(async (t) => {
    const json: string = await new Promise((resolve, reject) => {
        const packageJson = path.join(__dirname, '..', '.eslintrc.json');
        fs.readFile(packageJson, 'utf8', (error, string) => {
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
    const linter = new eslint.Linter();
    t.truthy(linter.verify('', t.context.config));
});

{
    const availableESLintRules = new eslint.Linter().getRules();
    for (const [ruleName, rule] of availableESLintRules) {
        const url = `https://eslint.org/docs/rules/${ruleName}`;
        if (rule.meta && rule.meta.deprecated) {
            test(`should not cover deprecated "${ruleName}"`, (t) => {
                const {rules = {}} = t.context.config;
                t.is(
                    rules[ruleName],
                    undefined,
                    `${ruleName} is deprecated.\n${url}`,
                );
            });
        } else {
            test(`should cover "${ruleName}"`, (t) => {
                const {rules = {}} = t.context.config;
                t.truthy(rules[ruleName], `${ruleName} is not covered.\n${url}`);
            });
        }
    }
    test('should have supported rules', (t) => {
        for (const rule of Object.keys(t.context.config.rules || {})) {
            t.true(availableESLintRules.has(rule), `${rule} is not supported`);
        }
    });
}

{
    const availableTypeScriptRules = new Map(Object.entries(eslintPlugin.rules));
    const prefix = '@typescript-eslint';
    // https://github.com/typescript-eslint/typescript-eslint/issues/101
    const rulesToBeIgnored = new Set<string>([
        'await-thenable',
        'no-floating-promises',
        'no-for-in-array',
        'no-unnecessary-qualifier',
        'no-unnecessary-type-assertion',
        'prefer-includes',
        'prefer-regexp-exec',
        'prefer-string-starts-ends-with',
        'prefer-readonly',
        'promise-function-async',
        'require-array-sort-compare',
        'restrict-plus-operands',
        'strict-boolean-expressions',
        'unbound-method',
    ]);
    const getTypeScriptRules = (
        t: ExecutionContext<ITextContext>,
    ): NonNullable<eslint.Linter.Config['rules']> => {
        const typescriptConfig = t.context.config.overrides
        .find((override) => override.parser === `${prefix}/parser`) || {};
        return typescriptConfig.rules || {};
    };
    for (const [ruleName, rule] of availableTypeScriptRules) {
        const url = `https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/${ruleName}.md`;
        if (rulesToBeIgnored.has(ruleName)) {
            test(`should ignore "${prefix}/${ruleName}"`, (t) => {
                const rules = getTypeScriptRules(t);
                const config = rules[`${prefix}/${ruleName}`];
                t.falsy(config, `${prefix}/${ruleName} should be ignored.\n${url}`);
            });
        } else if (rule.meta && rule.meta.deprecated) {
            test(`should not cover deprecated "${prefix}/${ruleName}"`, (t) => {
                const rules = getTypeScriptRules(t);
                const config = rules[`${prefix}/${ruleName}`];
                t.is(
                    config,
                    undefined,
                    `${prefix}/${ruleName} is deprecated.\n${url}`,
                );
            });
        } else {
            test(`should cover "${prefix}/${ruleName}"`, (t) => {
                const rules = getTypeScriptRules(t);
                const config = rules[`${prefix}/${ruleName}`];
                t.truthy(config, `${prefix}/${ruleName} is not covered.\n${url}`);
            });
        }
    }
    test('should have supported typescript-eslint rules', (t) => {
        const rules = getTypeScriptRules(t);
        const prefixLength = prefix.length + 1;
        for (const ruleName of Object.keys(rules).filter((name) => name.startsWith(prefix))) {
            t.true(
                availableTypeScriptRules.has(ruleName.slice(prefixLength)),
                `${ruleName} is not supported`,
            );
        }
    });
}
