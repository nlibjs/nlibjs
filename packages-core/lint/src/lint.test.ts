import test from 'ava';
import * as path from 'path';
import * as fs from 'fs';
import * as eslint from 'eslint';
import * as eslintPlugin from '@typescript-eslint/eslint-plugin';

const getConfig = new Promise<eslint.Linter.Config>((resolve, reject) => {
    const packageJson = path.join(__dirname, '..', '.eslintrc.json');
    fs.readFile(packageJson, 'utf8', (error, string) => {
        if (error) {
            reject(error);
        } else {
            resolve(JSON.parse(string));
        }
    });
});
const availableESLintRules = new eslint.Linter().getRules();
const availableTypeScriptRules = new Map(Object.entries(eslintPlugin.rules));
const prefix = '@typescript-eslint';
// https://github.com/typescript-eslint/typescript-eslint/issues/101
const rulesToBeIgnored = new Set<string>([]);
const getTypeScriptRules = getConfig.then(({overrides = []}) => {
    const typescriptConfig = overrides.find(({parser}) => parser === `${prefix}/parser`);
    return (typescriptConfig && typescriptConfig.rules) || {};
});

test('should be valid configuration', async (t) => {
    const linter = new eslint.Linter();
    t.truthy(linter.verify('', await getConfig));
});

for (const [ruleName, rule] of availableESLintRules) {
    const url = `https://eslint.org/docs/rules/${ruleName}`;
    if (rule.meta && rule.meta.deprecated) {
        test(`should not cover deprecated "${ruleName}"`, async (t) => {
            const {rules = {}} = await getConfig;
            t.is(rules[ruleName], undefined, `${ruleName} is deprecated.\n${url}`);
        });
    } else {
        test(`should cover "${ruleName}"`, async (t) => {
            const {rules = {}} = await getConfig;
            t.truthy(rules[ruleName], `${ruleName} is not covered.\n${url}`);
        });
    }
}

test('should have supported rules', async (t) => {
    for (const rule of Object.keys((await getConfig).rules || {})) {
        t.true(availableESLintRules.has(rule), `${rule} is not supported`);
    }
});

for (const [ruleName, rule] of availableTypeScriptRules) {
    const url = `https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/${ruleName}.md`;
    if (rulesToBeIgnored.has(ruleName)) {
        test(`should ignore "${prefix}/${ruleName}"`, async (t) => {
            const rules = await getTypeScriptRules;
            const config = rules[`${prefix}/${ruleName}`];
            t.falsy(config, `${prefix}/${ruleName} should be ignored.\n${url}`);
        });
    } else if (rule.meta && rule.meta.deprecated) {
        test(`should not cover deprecated "${prefix}/${ruleName}"`, async (t) => {
            const rules = await getTypeScriptRules;
            const config = rules[`${prefix}/${ruleName}`];
            t.is(config, undefined, `${prefix}/${ruleName} is deprecated.\n${url}`);
        });
    } else {
        test(`should cover "${prefix}/${ruleName}"`, async (t) => {
            const rules = await getTypeScriptRules;
            const config = rules[`${prefix}/${ruleName}`];
            t.truthy(config, `${prefix}/${ruleName} is not covered.\n${url}`);
        });
        if (availableESLintRules.has(ruleName)) {
            test(`should turn off "${ruleName}"`, async (t) => {
                const rules = await getTypeScriptRules;
                t.is(rules[ruleName], 'off', [
                    `${ruleName} should be disabled.`,
                    `Code: "${ruleName}": "off",`,
                    url,
                ].join('\n'));
            });
        }
    }
}

test('should have supported typescript-eslint rules', async (t) => {
    const rules = await getTypeScriptRules;
    const prefixLength = prefix.length + 1;
    for (const ruleName of Object.keys(rules).filter((name) => name.startsWith(prefix))) {
        t.true(
            availableTypeScriptRules.has(ruleName.slice(prefixLength)),
            `${ruleName} is not supported`,
        );
    }
});
