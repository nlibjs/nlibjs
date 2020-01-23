import test from 'ava';
import {fromString} from '@nlib/infra';
import {parseRFC3339} from './rfc3339';
import {runTests} from './util.test';

runTests(test, parseRFC3339, [
    {
        input: '1937-01-02T12:34:56.789+01:23',
        rule: 'date-time',
        expected: {
            name: 'date-time',
            nodes: [
                {
                    name: 'full-date',
                    nodes: [
                        {name: 'date-fullyear', nodes: [...fromString('1937')]},
                        ...fromString('-'),
                        {name: 'date-month', nodes: [...fromString('01')]},
                        ...fromString('-'),
                        {name: 'date-mday', nodes: [...fromString('02')]},
                    ],
                },
                ...fromString('T'),
                {

                    name: 'full-time',
                    nodes: [
                        {

                            name: 'partial-time',
                            nodes: [
                                {name: 'time-hour', nodes: [...fromString('12')]},
                                ...fromString(':'),
                                {name: 'time-minute', nodes: [...fromString('34')]},
                                ...fromString(':'),
                                {name: 'time-second', nodes: [...fromString('56')]},
                                {name: 'time-secfrac', nodes: [...fromString('.789')]},
                            ],
                        },
                        {

                            name: 'time-offset',
                            nodes: [
                                {
                                    name: 'time-numoffset',
                                    nodes: [
                                        ...fromString('+'),
                                        {name: 'time-hour', nodes: [...fromString('01')]},
                                        ...fromString(':'),
                                        {name: 'time-minute', nodes: [...fromString('23')]},
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
