import {fromString} from '@nlib/infra';
import {parseRFC6265} from './rfc6265';
import {runTests} from './util';

runTests(parseRFC6265, [
    {
        input: '/',
        rule: 'path-value',
        expected: {
            name: 'path-value',
            nodes: [...fromString('/')],
        },
    },
    {
        input: 'Path=/',
        rule: 'path-av',
        expected: {
            name: 'path-av',
            nodes: [
                ...fromString('Path='),
                {
                    name: 'path-value',
                    nodes: [...fromString('/')],
                },
            ],
        },
    },
    {
        input: 'Set-Cookie: FOO=BAR; PaTh=/foo; dOmAiN=example.com; ExPiReS=Wed, 09 Jun 2021 10:18:14 GMT; SeCuRe; HtTpOnLy; SaMeSiTe=lAX',
        rule: 'set-cookie-header',
        expected: {
            name: 'set-cookie-header',
            nodes: [
                ...fromString('Set-Cookie: '),
                {
                    name: 'set-cookie-string',
                    nodes: [
                        {
                            name: 'cookie-pair',
                            nodes: [
                                {
                                    name: 'cookie-name',
                                    nodes: [...fromString('FOO')],
                                },
                                ...fromString('='),
                                {
                                    name: 'cookie-value',
                                    nodes: [...fromString('BAR')],
                                },
                            ],
                        },
                        ...fromString('; '),
                        {
                            name: 'path-av',
                            nodes: [
                                ...fromString('PaTh='),
                                {
                                    name: 'path-value',
                                    nodes: [...fromString('/foo')],
                                },
                            ],
                        },
                        ...fromString('; '),
                        {
                            name: 'domain-av',
                            nodes: [
                                ...fromString('dOmAiN='),
                                {
                                    name: 'domain-value',
                                    nodes: [
                                        {
                                            name: 'label',
                                            nodes: [...fromString('example')],
                                        },
                                        ...fromString('.'),
                                        {
                                            name: 'label',
                                            nodes: [...fromString('com')],
                                        },
                                    ],
                                },
                            ],
                        },
                        ...fromString('; '),
                        {
                            name: 'expires-av',
                            nodes: [
                                ...fromString('ExPiReS='),
                                {
                                    name: 'sane-cookie-date',
                                    nodes: [...fromString('Wed, 09 Jun 2021 10:18:14 GMT')],
                                },
                            ],
                        },
                        ...fromString('; '),
                        {
                            name: 'secure-av',
                            nodes: [...fromString('SeCuRe')],
                        },
                        ...fromString('; '),
                        {
                            name: 'httponly-av',
                            nodes: [...fromString('HtTpOnLy')],
                        },
                        ...fromString('; '),
                        {
                            name: 'samesite-av',
                            nodes: [
                                ...fromString('SaMeSiTe='),
                                {
                                    name: 'samesite-value',
                                    nodes: [
                                        ...fromString('lAX'),
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
]);
