import {unionSetZ, hasSetZ, fromValuesSetZ} from '@nlib/real-number';
import {
    ASCIINewline,
    isASCIINewline,
    CHARACTER_TABULATION,
    SPACE,
    LINE_FEED,
    CARRIAGE_RETURN,
} from '@nlib/infra';

/** An HTTP tab or space is U+0009 TAB or U+0020 SPACE. */
export const HTTPTabOrSpace = fromValuesSetZ(CHARACTER_TABULATION, SPACE);
export const isHTTPTabOrSpace = (x: number): boolean => hasSetZ(HTTPTabOrSpace, x);

/** HTTP whitespace is U+000A LF, U+000D CR, or an HTTP tab or space. */
export const HTTPWhitespace = unionSetZ(fromValuesSetZ(LINE_FEED, CARRIAGE_RETURN), HTTPTabOrSpace);
export const isHTTPWhitespace = (x: number): boolean => hasSetZ(HTTPWhitespace, x);

/** An HTTP newline byte is 0x0A (LF) or 0x0D (CR). */
export const HTTPNewlineByte = ASCIINewline;
export const isHTTPNewlineByte = isASCIINewline;

/** An HTTP tab or space byte is 0x09 (HT) or 0x20 (SP). */
export const HTTPTabOrSpaceByte = HTTPTabOrSpace;
export const isHTTPTabOrSpaceByte = isHTTPTabOrSpace;

/** An HTTP whitespace byte is an HTTP newline byte or HTTP tab or space byte. */
export const HTTPWhitespaceByte = unionSetZ(HTTPNewlineByte, HTTPTabOrSpaceByte);
export const isHTTPWhitespaceByte = (x: number): boolean => hasSetZ(HTTPWhitespaceByte, x);
