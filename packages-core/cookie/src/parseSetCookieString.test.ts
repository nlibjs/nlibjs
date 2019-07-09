import test from 'ava';
import {
    JSON,
    Date,
    Math,
} from '@nlib/global';
import {parseSetCookieString} from './parseSetCookieString';
import * as index from './index';
import {SameSite} from './types';

const now = new Date();

test('index.parseSetCookieString', (t) => {
    t.is(index.parseSetCookieString, parseSetCookieString);
});


interface ITest {
    input: string,
    expected: ReturnType<typeof parseSetCookieString>,
}

([
    {
        input: 'a=foo',
        expected: {
            name: 'a',
            value: 'foo',
            domain: null,
            path: null,
            expires: null,
            maxAge: null,
            http: false,
            secure: false,
            samesite: SameSite.None,
        },
    },
    {
        input: 'a=foo; Foo=a',
        expected: null,
    },
    {
        input: 'a=foo; DoMain=foo.example.com',
        expected: {
            name: 'a',
            value: 'foo',
            domain: 'foo.example.com',
            path: null,
            expires: null,
            maxAge: null,
            http: false,
            secure: false,
            samesite: SameSite.None,
        },
    },
    {
        input: 'a=foo; DoMain=foo.example.com; Max-aGe=345',
        expected: {
            name: 'a',
            value: 'foo',
            domain: 'foo.example.com',
            path: null,
            expires: null,
            maxAge: 345,
            http: false,
            secure: false,
            samesite: SameSite.None,
        },
    },
    {
        input: `a=foo; DoMain=foo.example.com; Max-aGe=345; eXpiRes=${now.toUTCString()}`,
        expected: {
            name: 'a',
            value: 'foo',
            domain: 'foo.example.com',
            path: null,
            expires: now,
            maxAge: 345,
            http: false,
            secure: false,
            samesite: SameSite.None,
        },
    },
    {
        input: `a=foo; DoMain=foo.example.com; Max-aGe=345; eXpiRes=${now.toUTCString()}; HtTpOnLy; SeCuRe; SaMeSiTe=lAX; pAtH=/foo/bar`,
        expected: {
            name: 'a',
            value: 'foo',
            domain: 'foo.example.com',
            path: '/foo/bar',
            expires: now,
            maxAge: 345,
            http: true,
            secure: true,
            samesite: SameSite.Lax,
        },
    },
    {
        input: `a=foo; DoMain=.example.com; Max-aGe=345; eXpiRes=${now.toUTCString()}; HtTpOnLy; SeCuRe; SaMeSiTe=lAX; pAtH=/foo/bar`,
        expected: {
            name: 'a',
            value: 'foo',
            domain: 'example.com',
            path: '/foo/bar',
            expires: now,
            maxAge: 345,
            http: true,
            secure: true,
            samesite: SameSite.Lax,
        },
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${input} → ${JSON.stringify(expected)}`, (t) => {
        const actual = parseSetCookieString(input);
        if (!actual || !expected) {
            t.is(actual, expected);
            return;
        }
        if (expected.expires && actual.expires) {
            t.true(Math.abs(actual.expires.getTime() - expected.expires.getTime()) < 2000);
            delete expected.expires;
            delete actual.expires;
        }
        t.deepEqual(actual, expected);
    });
});
