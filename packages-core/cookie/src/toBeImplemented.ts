/**
 * @file These functions should be implemented correctly later.
 */

import {
    Set,
    Boolean,
} from '@nlib/global';
import {
    SOLIDUS,
    fromString,
    toString,
} from '@nlib/infra';

export const isNonHTTP = (protocol: string): boolean => !protocol.startsWith('http');

export const isPublicSuffix = (x: string): boolean => !x && Boolean(x);

export const convertLabel = (label: string): string => {
    return label.toLowerCase();
};

export const canonicalizeHostName = (hostname: string): string => hostname.split('.').map(convertLabel).join('.');

export const domainMatch = (
    string: string,
    domainString: string,
): boolean => {
    if (string === domainString) {
        return true;
    }
    return string.endsWith(domainString) &&
    string.slice(0, -domainString.length).endsWith('.') &&
    string.split('.').some((label) => (/^\w/).test(label));
};

export const getDefaultPath = (pathString: string): string => {
    const codePoints = fromString(pathString);
    if (codePoints[0] === SOLIDUS) {
        const lastSolidusIndex = codePoints.lastIndexOf(SOLIDUS);
        if (0 < lastSolidusIndex) {
            return toString(codePoints.slice(0, lastSolidusIndex));
        }
    }
    return '/';
};

export const SecureProtocols = new Set([
    'https:',
]);

export const SafeMethods = new Set([
    'get',
    'head',
    'options',
    'trace',
]);

export const getSiteForCookies = (context: URL): string => context.hostname;
