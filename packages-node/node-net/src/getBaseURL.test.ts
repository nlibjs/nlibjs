import test from 'ava';
import * as net from 'net';
import {getBaseURL} from './getBaseURL';

interface ITest {
    input: net.AddressInfo,
    protocol?: string,
    expected?: string,
}

([
    {
        input: '',
    },
    {
        input: {
            port: 3000,
            family: 'IPv6',
            address: '::',
        },
        expected: 'http://[::]:3000/',
    },
    {
        input: {
            port: 3000,
            family: 'IPv4',
            address: '127.0.0.1',
        },
        expected: 'http://127.0.0.1:3000/',
    },
    {
        input: {
            port: 80,
            family: 'IPv4',
            address: '127.0.0.1',
        },
        expected: 'http://127.0.0.1:80/',
    },
] as Array<ITest>).forEach(({input, expected, protocol}) => {
    test(`${JSON.stringify(input)} → ${expected || 'Error'}`, (t) => {
        if (expected) {
            const actual = getBaseURL(input, protocol);
            t.is(`${actual}`, `${new URL(expected)}`);
        } else {
            t.throws(() => getBaseURL(input, protocol));
        }
    });
});
