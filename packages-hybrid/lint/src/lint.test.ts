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

test('should cover all eslint rules', (t) => {
    const availableRules = new Linter().getRules();
    const {rules = {}} = t.context.config;
    for (const [ruleName] of availableRules) {
        t.truthy(rules[ruleName], `${ruleName} is not covered`);
    }
    for (const rule of Object.keys(rules)) {
        t.true(availableRules.has(rule), `${rule} is not supported`);
    }
});

test('should cover all typescript-eslint rules', (t) => {
    const prefix = '@typescript-eslint';
    const typescriptConfig = t.context.config.overrides
    .find((override) => override.parser === `${prefix}/parser`);
    if (!typescriptConfig) {
        t.truthy(typescriptConfig);
        return;
    }
    const {rules = {}} = typescriptConfig;
    const availableTypeScriptRuleNames = new Set(Object.keys(availableTypeScriptRules).map((name) => `${prefix}/${name}`));
    const rulesToBeIgnored = new Set([
        '@typescript-eslint/restrict-plus-operands',
    ]);
    for (const ruleName of availableTypeScriptRuleNames) {
        if (!rulesToBeIgnored.has(ruleName)) {
            const config = rules[ruleName];
            t.truthy(config, `${ruleName} is not covered`);
        }
    }
    for (const rule of Object.keys(rules).filter((name) => name.startsWith(prefix))) {
        t.true(availableTypeScriptRuleNames.has(rule), `${rule} is not supported`);
    }
});
