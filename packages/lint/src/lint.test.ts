import anyTest, {TestInterface} from 'ava';
import {join} from 'path';
import {readFile} from 'fs';
import {Linter} from 'eslint';

const test = anyTest as TestInterface<{
    config: Linter.Config
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

test('should cover all rules', (t) => {
    const availableRules = new Linter().getRules();
    const {rules = {}} = t.context.config;
    for (const [ruleName] of availableRules) {
        t.truthy(rules[ruleName], `${ruleName} is not covered`);
    }
    for (const rule of Object.keys(rules)) {
        t.true(availableRules.has(rule), `${rule} is not supported`);
    }
});
