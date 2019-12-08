import test from 'ava';
import {processFile} from './processFile';

const noop = () => {
    // noop
};

interface ITest {
    input: Parameters<typeof processFile>,
    expected: string | null,
}

([
    {
        input: ['foo.js', []],
        expected: null,
    },
    {
        input: ['foo.js', [{name: 'css', pattern: ['.css'], process: noop}]],
        expected: null,
    },
    {
        input: ['foo.css', [{name: 'css', pattern: ['.css'], process: noop}]],
        expected: 'css',
    },
    {
        input: ['foo.css', [
            {name: 'js', pattern: ['.js'], process: noop},
            {name: 'css1', pattern: [/\.css$/], process: noop},
            {name: 'css2', pattern: ['.css'], process: noop},
        ]],
        expected: 'css1',
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${input[0]} → ${expected}`, async (t) => {
        t.is(await processFile(...input), expected);
    });
});
