import {runTests, toNodes} from './util';
import {parseRFC2234} from './rfc2234';

runTests(parseRFC2234, [
    {
        input: 'A',
        rule: 'ALPHA',
        expected: {
            name: 'ALPHA',
            nodes: toNodes('A'),
        },
    },
    {
        input: ' aB',
        rule: 'ALPHA',
        from: 1,
        expected: {
            name: 'ALPHA',
            nodes: toNodes('a'),
        },
    },
]);
