// import {Linter} from 'eslint';
// import * as myConfig from '../.eslintrc.json';

// t.test('lint', (t) => {

//     t.test('validity', (t) => {
//         const linter = new Linter();
//         t.ok(linter.verify('', myConfig));
//         t.end();
//     });

//     t.test('coverage', (t) => {
//         const availableRules = new Linter().getRules();
//         for (const [ruleName] of availableRules) {
//             t.ok(myConfig.rules[ruleName], `${ruleName} is covered`);
//         }
//         for (const rule of Object.keys(myConfig.rules)) {
//             t.ok(availableRules.has(rule), `${rule} is not supported`);
//         }
//         t.end();
//     });

//     t.end();

// });
