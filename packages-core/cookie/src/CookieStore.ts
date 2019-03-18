import {
    Object,
    Date,
    Set,
} from '@nlib/global';
import {
    isNumber,
} from '@nlib/util';
import {
    createEmptyRootNode,
    getOrSetDefaultValue,
    getExistingValue,
    traceAncestorValues,
} from '@nlib/named-tree';
import {
    ICookie,
    ICookieStoreConfiguration,
    ICookieDomainStore,
    ICookiePackage,
    SameSite,
} from './types';
import {parseSetCookieString} from './parseSetCookieString';
import {
    isPublicSuffix,
    canonicalizeHostName,
    domainMatch,
    getDefaultPath,
    SecureProtocols,
    isNonHTTP,
    getSiteForCookies,
    SafeMethods,
} from './toBeImplemented';
import {
    domainToLabels,
    pathToEdges,
} from './util';

export class CookieStore {

    public readonly config: ICookieStoreConfiguration

    public readonly data: ICookieDomainStore

    public constructor(
        {
            acceptPublicSuffix = false,
            acceptThirdParty = false,
            accept = [],
            reject = [],
            filter = (x) => x,
        }: Partial<ICookieStoreConfiguration> = {},
    ) {
        this.config = {
            acceptPublicSuffix,
            acceptThirdParty,
            accept: accept.slice(),
            reject: reject.slice(),
            filter,
        };
        this.data = createEmptyRootNode();
    }

    public getCookieAt(
        domain: string,
        path: string,
        name: string,
    ): ICookie | null {
        const domainStore = getExistingValue(this.data, domainToLabels(domain));
        if (domainStore) {
            const pathStore = getExistingValue(domainStore, pathToEdges(path));
            if (pathStore) {
                const cookie = pathStore[name];
                if (cookie) {
                    return cookie;
                }
            }
        }
        return null;
    }

    public setCookie(cookie: ICookie): void {
        getOrSetDefaultValue<ICookiePackage>(
            getOrSetDefaultValue(
                this.data,
                domainToLabels(cookie.domain),
                () => createEmptyRootNode(),
            ),
            pathToEdges(cookie.path),
            () => ({}),
        )[cookie.name] = cookie;
    }

    /** https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-02#section-5.4 */
    public consume(
        setCookieString: string,
        origin: URL,
    ): Readonly<ICookie> | number {
        const parseResult = parseSetCookieString(setCookieString);
        let STEP = 0;
        if (!parseResult) {
            return STEP;
        }
        let expiryTime: number | Date | null = null;
        let persistentFlag = false;
        STEP = 3;
        if (isNumber(parseResult.maxAge)) {
            persistentFlag = true;
            expiryTime = parseResult.maxAge;
        } else if (parseResult.expires) {
            persistentFlag = true;
            expiryTime = parseResult.expires;
        }
        STEP = 4;
        const canonicalizedRequestHost = canonicalizeHostName(origin.hostname);
        STEP = 5;
        let domain = parseResult.domain || '';
        if (!this.config.acceptPublicSuffix && isPublicSuffix(domain)) {
            if (domain === canonicalizedRequestHost) {
                domain = '';
            } else {
                return STEP;
            }
        }
        STEP = 6;
        let hostOnlyFlag = false;
        if (domain) {
            if (!domainMatch(canonicalizedRequestHost, domain)) {
                return STEP;
            }
        } else {
            hostOnlyFlag = true;
            domain = canonicalizedRequestHost;
        }
        STEP = 7;
        const path = parseResult.path || getDefaultPath(origin.pathname);
        STEP = 8;
        const secureOnlyFlag = parseResult.secure;
        const isNotSecureProtocol = !SecureProtocols.has(origin.protocol);
        STEP = 9;
        if (secureOnlyFlag && isNotSecureProtocol) {
            return STEP;
        }
        STEP = 10;
        const httpOnlyFlag = parseResult.http;
        STEP = 11;
        const nonHTTP = isNonHTTP(origin.protocol);
        if (httpOnlyFlag && nonHTTP) {
            return STEP;
        }
        STEP = 12;
        const {name} = parseResult;
        if (!secureOnlyFlag && isNotSecureProtocol) {
            // 12.3
            const domainStore = getExistingValue(this.data, domainToLabels(domain));
            if (domainStore) {
                // 12.4
                for (const cookiePackage of traceAncestorValues(domainStore, pathToEdges(path))) {
                    // 12.1
                    const cookie = cookiePackage[name];
                    // 12.2
                    if (cookie && cookie.secureOnlyFlag) {
                        return STEP;
                    }
                }
            }
        }
        STEP = 13;
        const sameSiteFlag = parseResult.samesite;
        const isSameSiteRequest = getSiteForCookies(origin) === domain;
        STEP = 14;
        if (sameSiteFlag !== SameSite.None && !isSameSiteRequest) {
            return STEP;
        }
        STEP = 15;
        if (name.startsWith('__Secure-') && !secureOnlyFlag) {
            return STEP;
        }
        STEP = 16;
        if (name.startsWith('__Host-') && !(secureOnlyFlag && hostOnlyFlag && parseResult.path === '/')) {
            return STEP;
        }
        STEP = 17;
        const now = new Date();
        let creationTime = now;
        {
            const oldCookie = this.getCookieAt(domain, path, name);
            if (oldCookie) {
                if (nonHTTP && oldCookie.httpOnlyFlag) {
                    return STEP;
                }
                creationTime = oldCookie.creationTime;
            }
        }
        const cookie: ICookie = {
            name,
            value: parseResult.value,
            expiryTime,
            domain,
            path,
            creationTime,
            persistentFlag,
            hostOnlyFlag,
            httpOnlyFlag,
            secureOnlyFlag: parseResult.secure,
            sameSiteFlag,
            lastAccessTime: now,
        };
        this.setCookie(cookie);
        return cookie;
    }

    public* anchestorsFrom(
        domain: string,
        path: string,
    ): IterableIterator<ICookie> {
        for (const domainStore of traceAncestorValues(this.data, domainToLabels(domain))) {
            for (const cookiePackage of traceAncestorValues(domainStore, pathToEdges(path))) {
                for (const key of Object.keys(cookiePackage)) {
                    const cookie = cookiePackage[key];
                    if (cookie) {
                        yield cookie;
                    }
                }
            }
        }
    }

    public* pickCookiesFor(
        method: string,
        requestURL: URL,
        fromURL: URL,
    ): IterableIterator<ICookie> {
        const canonicalizedHostName = canonicalizeHostName(fromURL.hostname);
        const secureProtocol = SecureProtocols.has(requestURL.protocol);
        const isHTTP = !isNonHTTP(requestURL.protocol);
        const isSameSiteRequest = getSiteForCookies(requestURL) === canonicalizedHostName;
        const isSafeMethod = SafeMethods.has(method.toLowerCase());
        const isTopLevelContext = true;
        const pickedNames: Set<string> = new Set();
        for (const cookie of this.anchestorsFrom(requestURL.hostname, requestURL.pathname)) {
            if (
                !pickedNames.has(cookie.name) &&
                (
                    (cookie.hostOnlyFlag && cookie.domain === canonicalizedHostName) ||
                    !cookie.hostOnlyFlag
                ) &&
                (
                    !cookie.secureOnlyFlag ||
                    secureProtocol
                ) &&
                (
                    !cookie.httpOnlyFlag ||
                    isHTTP
                ) &&
                (
                    cookie.sameSiteFlag === SameSite.None ||
                    isSameSiteRequest ||
                    (
                        cookie.sameSiteFlag === SameSite.Lax &&
                        isSafeMethod &&
                        isTopLevelContext
                    )
                )
            ) {
                pickedNames.add(cookie.name);
                cookie.lastAccessTime = new Date();
                yield cookie;
            }
        }
    }

    public getCookieStringFor(
        method: string,
        requestURL: URL,
        fromURL: URL,
    ): string {
        return [...this.pickCookiesFor(method, requestURL, fromURL)]
        .sort(({creationTime: d1}, {creationTime: d2}) => d1.getTime() - d2.getTime())
        .map(({name, value}) => `${name}=${value}`)
        .join('; ');
    }

}
