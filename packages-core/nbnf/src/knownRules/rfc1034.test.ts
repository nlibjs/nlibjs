import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRFC1034} from './rfc1034';
import {toNodes, runTests} from './util';

runTests(test, parseRFC1034, [
    {
        input: 'abcxyzABCXYZ',
        rule: 'lgh-str',
        expected: {
            name: 'lgh-str',
            nodes: toNodes('abcxyzABCXYZ'),
        },
    },
    {
        input: 'abc-xyz-ABC-XYZ',
        rule: 'label',
        expected: {
            name: 'label',
            nodes: toNodes('abc-xyz-ABC-XYZ'),
        },
    },
    {
        input: 'www-www.example.com',
        rule: 'label',
        expected: {
            name: 'label',
            nodes: toNodes('www-www'),
        },
    },
    {
        input: 'www-www.example.com',
        rule: 'domain',
        expected: {
            name: 'domain',
            nodes: [
                {
                    name: 'label',
                    nodes: toNodes('www-www'),
                },
                ...fromString('.'),
                {
                    name: 'label',
                    nodes: toNodes('example'),
                },
                ...fromString('.'),
                {
                    name: 'label',
                    nodes: toNodes('com'),
                },
            ],
        },
    },
]);
