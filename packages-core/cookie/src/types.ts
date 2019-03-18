import {
    INamedTreeNode,
} from '@nlib/named-tree';
export const enum SameSite {
    Strict = 'strict',
    Lax = 'lax',
    None = 'none',
}
export interface ICookieParseResult {
    name: string,
    value: string,
    domain: string | null,
    path: string | null,
    expires: Date | null,
    maxAge: number | null,
    http: boolean,
    secure: boolean,
    samesite: SameSite,
}
// https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-02#section-5.4
export interface ICookie {
    name: string,
    value: string,
    expiryTime: Date | number | null,
    domain: string,
    path: string,
    creationTime: Date,
    lastAccessTime: Date,
    persistentFlag: boolean,
    hostOnlyFlag: boolean,
    secureOnlyFlag: boolean,
    httpOnlyFlag: boolean,
    sameSiteFlag: SameSite,
}
export interface ICookieFilter {
    (cookie: ICookie): ICookie | null | undefined,
}
export interface ICookieStoreConfiguration {
    acceptPublicSuffix: boolean,
    acceptThirdParty: boolean,
    reject: Array<string>,
    accept: Array<string>,
    filter: ICookieFilter,
}
export interface ICookiePackage {
    [name: string]: ICookie | undefined,
}
export type ICookiePathStore = INamedTreeNode<ICookiePackage>;
export type ICookieDomainStore = INamedTreeNode<ICookiePathStore>;
