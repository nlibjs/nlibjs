import test from 'ava';
import {removeSourceMapLines} from './removeSourceMapLines';

interface ITest {
    input: Parameters<typeof removeSourceMapLines>[0],
    expected: ReturnType<typeof removeSourceMapLines>,
}

([
    {
        input: ['foo'].join('\n'),
        expected: ['foo'].join('\n'),
    },
    {
        input: [
            '',
            '  // # sourceMappingURL = ',
            'foo',
            '  /* # sourceMappingURL = ',
            'bar',
        ].join('\n'),
        expected: ['', 'foo', 'bar'].join('\n'),
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index}`, (t) => {
        t.is(removeSourceMapLines(input), expected);
    });
});
