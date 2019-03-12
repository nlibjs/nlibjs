import {Infinity} from '@nlib/global';
import {SEMICOLON} from '@nlib/infra';
import {
    intersectionSetZ,
    unionSetZ,
    fromValuesSetZ,
    complementSetZ,
} from '@nlib/real-number';
import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {normalizeNBNF} from '../normalizeNBNF';
import {NBNFNormalizedElementType} from '../types';
import {normalizeRuleList} from '../normalize';
import {RFC2234Rules} from './rfc2234';
import {
    RFC2616tokenSet,
    RFC2616Rules,
    RFC2616CHARSet,
    RFC2616CTLSet,
} from './rfc2616';
import {RFC1034Rules} from './rfc1034';

// https://tools.ietf.org/htm./rfc6265#section-4.1.1
// https://tools.ietf.org/html/draft-ietf-httpbis-RFC6265bis-02#section-4.1.1

export const pathValueSet = intersectionSetZ(
    RFC2616CHARSet,
    complementSetZ(unionSetZ(
        RFC2616CTLSet,
        fromValuesSetZ(SEMICOLON),
    )),
);

export const RFC6265NBNF = `
set-cookie-header = %i"Set-Cookie:" SP set-cookie-string
set-cookie-string = cookie-pair *( ";" SP cookie-av )
cookie-pair       = cookie-name "=" cookie-value
cookie-name       = token
cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
                      ; US-ASCII characters excluding CTLs,
                      ; whitespace DQUOTE, comma, semicolon,
                      ; and backslash
 ;token             = <token, defined in [RFC2616], Section 2.2>

cookie-av         = expires-av / max-age-av / domain-av /
                    path-av / secure-av / httponly-av /
                    samesite-av / extension-av
expires-av        = %i"Expires=" sane-cookie-date
 ;sane-cookie-date  = <rfc1123-date, defined in [RFC2616], Section 3.3.1>
max-age-av        = %i"Max-Age=" decimal-value
                      ; In practice, both expires-av and max-age-av
                      ; are limited to dates representable by the
                      ; user agent.
decimal-value     = non-zero-digit *DIGIT
non-zero-digit    = %x31-39
                      ; digits 1 through 9
domain-av         = %i"Domain=" domain-value
 ;domain-value      = <subdomain>
                      ; defined in [RFC1034], Section 3.5, as
                      ; enhanced by [RFC1123], Section 2.1
path-av           = %i"Path=" path-value
path-value        = *av-octet
secure-av         = %i"Secure"
httponly-av       = %i"HttpOnly"
samesite-av       = %i"SameSite=" samesite-value
samesite-value    = %i"Strict" / %i"Lax"
extension-av      = *av-octet
av-octet          = %x20-3A / %x3C-7E
                      ; any CHAR except CTLs or ";"
`;

export let RFC6265Rules = normalizeNBNF(RFC6265NBNF, {
    includes: {
        ...RFC1034Rules,
        'token': [
            [{repeat: [1, Infinity], element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616tokenSet}}],
        ],
        'sane-cookie-date': RFC2616Rules['HTTP-date'],
        'domain-value': RFC1034Rules.domain,
    },
    expands: {
        ...RFC2234Rules,
    },
});

RFC6265Rules = normalizeRuleList(RFC6265Rules, {
    'token': RFC6265Rules.token,
    'cookie-octet': RFC6265Rules['cookie-octet'],
    'non-zero-digit': RFC6265Rules['non-zero-digit'],
    'cookie-av': RFC6265Rules['cookie-av'],
    'av-octet': RFC6265Rules['av-octet'],
    // 'expires-av': RFC6265Rules['expires-av'],
    // 'max-age-av': RFC6265Rules['max-age-av'],
    // 'domain-av': RFC6265Rules['domain-av'],
    // 'path-av': RFC6265Rules['path-av'],
    // 'secure-av': RFC6265Rules['secure-av'],
    // 'httponly-av': RFC6265Rules['httponly-av'],
    // 'extension-av': RFC6265Rules['extension-av'],
});

export const parseRFC6265 = createTokenizerFromNormalizedRuleList(RFC6265Rules);
