import test from 'ava';
import * as path from 'path';
import {parseIndexenCLIArgs} from './parseIndexenCLIArgs';
import {defaultConfigurations} from './defaultConfigurations';

interface ITest {
    input: Array<string>,
    expected: ReturnType<typeof parseIndexenCLIArgs> | null,
}

([
    {
        input: ['src'],
        expected: {
            directory: path.join(__dirname, 'src'),
        },
    },
    {
        input: ['src', '--dest', 'foo'],
        expected: {
            directory: path.join(__dirname, 'src'),
            dest: path.join(__dirname, 'foo'),
        },
    },
    {
        input: ['--dest', 'foo', 'src'],
        expected: {
            directory: path.join(__dirname, 'src'),
            dest: path.join(__dirname, 'foo'),
        },
    },
    {
        input: ['foo', 'src'],
        expected: null,
    },
    {
        input: [],
        expected: null,
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(
        `#${index} ${input.join(' ')} → ${expected ? JSON.stringify(expected) : 'Error'}`,
        (t) => {
            if (expected) {
                t.deepEqual(parseIndexenCLIArgs(input, __dirname), {
                    ...defaultConfigurations,
                    ...expected,
                });
            } else {
                t.throws(() => parseIndexenCLIArgs(input, __dirname));
            }
        },
    );
});
