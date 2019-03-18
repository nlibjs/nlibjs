import test from 'ava';
import {
    URL,
    JSON,
} from '@nlib/global';
import {CookieStore} from './CookieStore';
import * as index from './index';

test('index.CookieStore', (t) => {
    t.is(index.CookieStore, CookieStore);
});

interface ITest {
    title?: string,
    requests: Array<{
        origin: string,
        url: string,
        method?: string,
        cookieString?: string,
        cookies?: Array<string>,
    }>,
}

([
    {
        title: 'flat',
        requests: [
            {
                origin: 'http://example.com',
                cookies: ['A=aaa', 'B=aaa'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=aaa; B=aaa',
                cookies: ['A=bbb'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=bbb; B=aaa',
            },
        ],
    },
    {
        title: 'subdomain',
        requests: [
            {
                origin: 'http://example.com',
                cookies: ['A=aaa', 'B=aaa'],
            },
            {
                origin: 'http://foo.example.com',
                cookieString: '',
                cookies: ['A=bbb'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=aaa; B=aaa',
            },
            {
                origin: 'http://foo.example.com',
                cookieString: 'A=bbb',
            },
        ],
    },
    {
        title: 'max-age',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa; MaX-AgE=300'],
            },
            {
                origin: 'https://example.com',
                cookieString: 'A=aaa',
            },
        ],
    },
    {
        title: 'Secures blocks unsecures on child',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa; SeCuRe; pAtH=/foo'],
            },
            {
                origin: 'http://example.com',
                cookieString: '',
                cookies: ['A=bbb; pAtH=/foo/bar'],
            },
            {
                origin: 'https://example.com/foo',
                cookieString: 'A=aaa',
            },
        ],
    },
    {
        title: 'Domain',
        requests: [
            {
                origin: 'http://example.com',
                cookies: ['A=aaa', 'B=aaa; DoMaIn=example.com'],
            },
            {
                origin: 'http://foo.example.com',
                cookieString: 'B=aaa',
                cookies: ['A=bbb; DoMaIn=example.com'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=bbb; B=aaa',
                cookies: ['A=ccc; DoMaIn=foo.example.com'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=bbb; B=aaa',
            },
            {
                origin: 'http://foo.example.com',
                cookieString: 'A=bbb; B=aaa',
            },
        ],
    },
    {
        title: 'Secure http',
        requests: [
            {
                origin: 'http://example.com',
                cookies: ['A=aaa'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=aaa',
                cookies: ['A=bbb'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=bbb',
                cookies: ['A=ccc; SeCuRe'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=bbb',
            },
        ],
    },
    {
        title: 'Secure https',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa'],
            },
            {
                origin: 'https://example.com',
                cookieString: 'A=aaa',
                cookies: ['A=bbb'],
            },
            {
                origin: 'https://example.com',
                cookieString: 'A=bbb',
                cookies: ['A=ccc; SeCuRe'],
            },
            {
                origin: 'https://example.com',
                cookieString: 'A=ccc',
            },
        ],
    },
    {
        title: 'HTTPOnly',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa; HtTpOnLy'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=aaa',
            },
            {
                origin: 'ws://example.com',
                cookieString: '',
                cookies: ['A=bbb; HtTpOnLy'],
            },
            {
                origin: 'ws://example.com',
                cookieString: '',
                cookies: ['A=ccc'],
            },
            {
                origin: 'http://example.com',
                cookieString: 'A=aaa',
            },
        ],
    },
    {
        title: 'SameSite=Lax',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa; DoMaIn=example.com; SaMeSiTe=Lax'],
            },
            {
                origin: 'https://foo.example.com',
                cookies: ['A=bbb; DoMaIn=example.com; SaMeSiTe=Lax'],
            },
            {
                origin: 'http://example.com',
                url: 'http://foo.example.com',
                cookieString: 'A=aaa',
            },
            {
                origin: 'http://example.com',
                url: 'http://foo.example.com',
                method: 'post',
                cookieString: '',
            },
        ],
    },
    {
        title: 'SameSite=Strict',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['A=aaa; DoMaIn=example.com; SaMeSiTe=StRiCt'],
            },
            {
                origin: 'https://foo.example.com',
                cookies: ['A=bbb; DoMaIn=example.com; SaMeSiTe=StRiCt'],
            },
            {
                origin: 'http://example.com',
                url: 'http://foo.example.com',
                cookieString: '',
            },
        ],
    },
    {
        title: '__Secure-XXX',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['__Secure-A=aaa'],
            },
            {
                origin: 'https://example.com',
                cookieString: '',
                cookies: ['__Secure-A=bbb; SeCuRe'],
            },
            {
                origin: 'https://example.com',
                cookieString: '__Secure-A=bbb',
            },
        ],
    },
    {
        title: '__Host-XXX',
        requests: [
            {
                origin: 'https://example.com',
                cookies: ['__Host-A=aaa'],
            },
            {
                origin: 'https://example.com',
                cookieString: '',
                cookies: ['__Host-A=bbb; SeCuRe'],
            },
            {
                origin: 'https://example.com',
                cookieString: '',
                cookies: ['__Host-A=ccc; SeCuRe; pAtH=/'],
            },
            {
                origin: 'https://example.com',
                cookieString: '__Host-A=ccc',
            },
        ],
    },
] as Array<ITest>).forEach(({title = '', requests}, index) => {
    test(`#${index} ${title}`, (t) => {
        const store = new CookieStore();
        requests.forEach(({origin, url = origin, method = 'get', cookieString, cookies}, requestIndex) => {
            if (typeof cookieString === 'string') {
                t.is(
                    store.getCookieStringFor(method, new URL(url), new URL(origin)),
                    cookieString,
                    `Error at ${index}.${requestIndex} ${cookieString}`,
                );
            }
            if (cookies) {
                for (const setCookie of cookies) {
                    const consumed = store.consume(setCookie, new URL(url));
                    t.log(`${setCookie} → ${JSON.stringify(consumed, null, 2)}`);
                }
            }
        });
    });
});
