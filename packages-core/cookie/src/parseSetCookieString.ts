import {
    Date,
    console,
} from '@nlib/global';
import {
    toASCIILowerCaseCodePoint,
} from '@nlib/infra';
import {
    nodeToScalarValueString,
    parseRFC6265,
    parseDecLiteral,
    isASTRuleNode,
    nodeToString,
    INBNFASTRuleNode,
    INBNFASTNode,
} from '@nlib/nbnf';
import {
    isNumber,
    getLast,
    NlibError,
} from '@nlib/util';
import {
    ICookieParseResult,
    SameSite,
} from './types';

export const extractCookieNodesFrom = (
    setCookieString: string,
): {name: INBNFASTRuleNode, value: INBNFASTRuleNode, attributes: Array<INBNFASTNode>} | null => {
    const token = parseRFC6265(setCookieString, 'set-cookie-string', 0, () => {});
    if (isASTRuleNode(token, 'set-cookie-string')) {
        const {nodes: [pairNode, ...attributes]} = token;
        if (isASTRuleNode(pairNode, 'cookie-pair')) {
            const {nodes: [name,, value]} = pairNode;
            if (isASTRuleNode(name, 'cookie-name') && isASTRuleNode(value, 'cookie-value')) {
                return {name, value, attributes};
            }
        }
    }
    return null;
};

// https://tools.ietf.org/html/rfc6265#section-4.1.2.1
export const extractExpiresFrom = (
    attributeNode: INBNFASTRuleNode,
): Date | null => {
    const expiresValueNode = getLast(attributeNode.nodes);
    if (isASTRuleNode(expiresValueNode, 'sane-cookie-date')) {
        return new Date(nodeToString(expiresValueNode));
    }
    console.error(new NlibError({
        code: 'cookie/parseCookieString/1',
        message: `Invalid Expires: ${nodeToString(attributeNode)}`,
        data: attributeNode,
    }));
    return null;
};

// https://tools.ietf.org/html/rfc6265#section-4.1.2.2
export const extractMaxAgeFrom = (
    attributeNode: INBNFASTRuleNode,
): number | null => {
    const maxAgeValueNode = getLast(attributeNode.nodes);
    if (isASTRuleNode(maxAgeValueNode, 'decimal-value')) {
        return parseDecLiteral(nodeToScalarValueString(maxAgeValueNode));
    }
    console.error(new NlibError({
        code: 'cookie/parseCookieString/2',
        message: `Invalid Max-Age: ${nodeToString(attributeNode)}`,
        data: attributeNode,
    }));
    return null;
};

// https://tools.ietf.org/html/rfc6265#section-4.1.2.3
export const extractDomainFrom = (
    attributeNode: INBNFASTRuleNode,
): string | null => {
    const domainValueNode = getLast(attributeNode.nodes);
    if (isASTRuleNode(domainValueNode, 'domain-value')) {
        return nodeToString(domainValueNode);
    }
    return null;
};

// https://tools.ietf.org/html/rfc6265#section-4.1.2.4
export const extractPathFrom = (
    attributeNode: INBNFASTRuleNode,
): string | null => {
    const pathValueNode = getLast(attributeNode.nodes);
    if (isASTRuleNode(pathValueNode, 'path-value')) {
        return nodeToString(pathValueNode);
    }
    console.error(new NlibError({
        code: 'cookie/parseCookieString/3',
        message: `Invalid Path: ${nodeToString(attributeNode)}`,
        data: attributeNode,
    }));
    return null;
};

// https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-02#section-4.1.2.7
export const extractSameSiteFrom = (
    attributeNode: INBNFASTRuleNode,
): SameSite => {
    const samesiteValueNode = getLast(attributeNode.nodes);
    if (isASTRuleNode(samesiteValueNode, 'samesite-value')) {
        switch (nodeToString(samesiteValueNode, toASCIILowerCaseCodePoint)) {
        case 'strict':
            return SameSite.Strict;
        case 'lax':
            return SameSite.Lax;
        default:
        }
    }
    return SameSite.None;
};

export const parseSetCookieString = (
    setCookieString: string,
): ICookieParseResult | null => {
    const nodes = extractCookieNodesFrom(setCookieString);
    if (!nodes) {
        return null;
    }
    let domain: string | null = null;
    let maxAge: number | null = null;
    let expires: Date | null = null;
    let path = null;
    let http = false;
    let secure = false;
    let samesite: SameSite = SameSite.None;
    for (const attributeNode of nodes.attributes) {
        if (!isNumber(attributeNode)) {
            switch (attributeNode.name) {
            case 'expires-av':
                expires = extractExpiresFrom(attributeNode) || expires;
                break;
            case 'max-age-av':
                maxAge = extractMaxAgeFrom(attributeNode) || maxAge;
                break;
            case 'domain-av':
                domain = extractDomainFrom(attributeNode) || domain;
                break;
            case 'path-av':
                path = extractPathFrom(attributeNode) || path;
                break;
            case 'secure-av':
                secure = true;
                break;
            case 'httponly-av':
                http = true;
                break;
            case 'samesite-av':
                samesite = extractSameSiteFrom(attributeNode);
                break;
            case 'extension-av':
            default:
                console.error(new NlibError({
                    code: 'cookie/parseCookieString/4',
                    message: `Unsupported attribute: ${nodeToString(attributeNode)}`,
                    data: setCookieString,
                }));
                return null;
            }
        }
    }
    return {
        name: nodeToString(nodes.name),
        value: nodeToString(nodes.value),
        domain,
        path,
        expires,
        maxAge,
        http,
        secure,
        samesite,
    };
};
