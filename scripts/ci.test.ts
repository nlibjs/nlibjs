import * as path from 'path';
import test from 'ava';
import {packageList} from './constants';
import {commitlint} from '../package.json';

test('commitlint', (t) => {
    const scopes = commitlint.rules['scope-enum'][2];
    if (Array.isArray(scopes)) {
        const scopeEnum = new Set(scopes);
        const checkEnum = (name: string) => {
            t.true(
                scopeEnum.has(name),
                `commitlint.rules.scope-enum[2] should have "${name}"`,
            );
        };
        for (const {fullPath} of packageList) {
            checkEnum(path.basename(fullPath));
        }
        checkEnum('deps');
    } else {
        t.true(
            Array.isArray(scopes),
            `commitlint.rules.scope-enum[2] should be an array: ${scopes}`,
        );
    }
});

