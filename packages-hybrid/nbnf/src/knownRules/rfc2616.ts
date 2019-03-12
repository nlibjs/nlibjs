import {Infinity} from '@nlib/global';
import {
    DELETE,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
    LESS_THAN_SIGN,
    GREATER_THAN_SIGN,
    COMMERCIAL_AT,
    COMMA,
    SEMICOLON,
    COLON,
    REVERSE_SOLIDUS,
    QUOTATION_MARK,
    SOLIDUS,
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    QUESTION_MARK,
    EQUALS_SIGN,
    LEFT_CURLY_BRACKET,
    RIGHT_CURLY_BRACKET,
    SPACE,
    CHARACTER_TABULATION,
} from '@nlib/infra';
import {
    unionSetZ,
    intersectionSetZ,
    SetZ,
    complementSetZ,
    fromValuesSetZ,
} from '@nlib/real-number';
import {normalizeNBNF} from '../normalizeNBNF';
import {RFC2234Rules} from './rfc2234';
import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {normalizeRuleList} from '../normalize';
import {NBNFNormalizedElementType} from '../types';

// https://tools.ietf.org/htm./rfc2616#section-2.2

export const RFC2616OCTETSet: SetZ = [[0x00, 0xFF]];
export const RFC2616CHARSet: SetZ = [[0x00, 0x7F]];
export const RFC2616CTLSet: SetZ = [[0, 31], [DELETE, DELETE]];

/**
 * separators = "(" | ")" | "<" | ">"
 *            | "@" | "," | ";" | ":"
 *            | "\" | <"> | "/" | "["
 *            | "]" | "?" | "=" | "{"
 *            | "}" | SP | HT
 */
export const RFC2616separatorsSet = fromValuesSetZ(
    LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LESS_THAN_SIGN, GREATER_THAN_SIGN,
    COMMERCIAL_AT, COMMA, SEMICOLON, COLON,
    REVERSE_SOLIDUS, QUOTATION_MARK, SOLIDUS, LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET, QUESTION_MARK, EQUALS_SIGN, LEFT_CURLY_BRACKET,
    RIGHT_CURLY_BRACKET, SPACE, CHARACTER_TABULATION,
);

/** token = 1*<any CHAR except CTLs or separators> */
export const RFC2616tokenSet = intersectionSetZ(
    RFC2616CHARSet,
    complementSetZ(unionSetZ(RFC2616CTLSet, RFC2616separatorsSet)),
);

export let RFC2616BasicRules = normalizeNBNF(`
 ;OCTET         = %x00-FF
 ;CHAR          = %x00-7F
UPALPHA       = %x41-5A
LOALPHA       = %x61-7A
ALPHA         = UPALPHA / LOALPHA
DIGIT         = %x30-39
 ;CTL           = %d0-31 / %d127
CR            = %d13
LF            = %d10
SP            = %d32
HT            = %d9
<">           = %d34
CRLF          = CR LF
LWS           = [CRLF] 1*( SP / HT )
 ;TEXT          = <any OCTET except CTLs, but including LWS>
HEX           = "A" / "B" / "C" / "D" / "E" / "F" / "a" / "b" / "c" / "d" / "e" / "f" / DIGIT
 ;token         = 1*<any CHAR except CTLs or separators>
 ;separators    = "(" / ")" / "<" / ">" / "@" / "," / ";" / ":" / "\\" / <"> / "/" / "[" / "]" / "?" / "=" / "{" / "}" / SP / HT
comment       = "(" *( ctext / quoted-pair / comment ) ")"
 ;ctext         = <any TEXT excluding "\\" "(" and ")">
quoted-string = <"> *( qdtext / quoted-pair ) <">
 ;qdtext         = <any TEXT excluding "\\" <">>
quoted-pair    = "\\\\" CHAR
`, {
    includes: {
        OCTET: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616OCTETSet},
                },
            ],
        ],
        CHAR: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616CHARSet},
                },
            ],
        ],
        CTL: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616CTLSet},
                },
            ],
        ],
        TEXT: [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.Group,
                        data: [
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.CodePoint,
                                        data: unionSetZ(
                                            intersectionSetZ(
                                                RFC2616OCTETSet,
                                                complementSetZ(RFC2616CTLSet),
                                            ),
                                        ),
                                    },
                                },
                            ],
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.RuleName,
                                        data: 'LWS',
                                    },
                                },
                            ],
                        ],
                    },
                },
            ],
        ],
        token: [
            [
                {
                    repeat: [1, Infinity],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616tokenSet},
                },
            ],
        ],
        separators: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: RFC2616separatorsSet},
                },
            ],
        ],
        ctext: [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.Group,
                        data: [
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.CodePoint,
                                        data: unionSetZ(
                                            intersectionSetZ(
                                                RFC2616OCTETSet,
                                                complementSetZ(
                                                    unionSetZ(
                                                        RFC2616CTLSet,
                                                        fromValuesSetZ(
                                                            REVERSE_SOLIDUS,
                                                            LEFT_PARENTHESIS,
                                                            RIGHT_PARENTHESIS,
                                                        ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                    },
                                },
                            ],
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.RuleName,
                                        data: 'LWS',
                                    },
                                },
                            ],
                        ],
                    },
                },
            ],
        ],
        qdtext: [
            [
                {
                    repeat: [1, 1],
                    element: {
                        type: NBNFNormalizedElementType.Group,
                        data: [
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.CodePoint,
                                        data: unionSetZ(
                                            intersectionSetZ(
                                                RFC2616OCTETSet,
                                                complementSetZ(
                                                    unionSetZ(
                                                        RFC2616CTLSet,
                                                        fromValuesSetZ(
                                                            REVERSE_SOLIDUS,
                                                            QUOTATION_MARK,
                                                        ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                    },
                                },
                            ],
                            [
                                {
                                    repeat: [1, 1],
                                    element: {
                                        type: NBNFNormalizedElementType.RuleName,
                                        data: 'LWS',
                                    },
                                },
                            ],
                        ],
                    },
                },
            ],
        ],
    },
});

RFC2616BasicRules = normalizeRuleList(RFC2616BasicRules, RFC2616BasicRules);

// https://tools.ietf.org/htm./rfc2616#section-3.3.1
export let RFC2616DateRules = normalizeNBNF(`
HTTP-date    = rfc1123-date / rfc850-date / asctime-date
rfc1123-date = wkday "," SP date1 SP time SP "GMT"
rfc850-date  = weekday "," SP date2 SP time SP "GMT"
asctime-date = wkday SP date3 SP time SP 4DIGIT
date1        = 2DIGIT SP month SP 4DIGIT
               ; day month year (e.g., 02 Jun 1982)
date2        = 2DIGIT "-" month "-" 2DIGIT
               ; day-month-year (e.g., 02-Jun-82)
date3        = month SP ( 2DIGIT / ( SP 1DIGIT ))
               ; month day (e.g., Jun  2)
time         = 2DIGIT ":" 2DIGIT ":" 2DIGIT
               ; 00:00:00 - 23:59:59
wkday        = "Mon" / "Tue" / "Wed"
             / "Thu" / "Fri" / "Sat" / "Sun"
weekday      = "Monday" / "Tuesday" / "Wednesday"
             / "Thursday" / "Friday" / "Saturday" / "Sunday"
month        = "Jan" / "Feb" / "Mar" / "Apr"
             / "May" / "Jun" / "Jul" / "Aug"
             / "Sep" / "Oct" / "Nov" / "Dec"
`, {expands: RFC2234Rules});

RFC2616DateRules = normalizeRuleList(RFC2616DateRules, RFC2616DateRules);

export const RFC2616Rules = {
    ...RFC2616BasicRules,
    ...RFC2616DateRules,
};

export const parseRFC2616 = createTokenizerFromNormalizedRuleList(RFC2616Rules);
