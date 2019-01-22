import {unionZ, eq} from '@nlib/real-number';
import {ASCIINewline, isASCIINewline} from '@nlib/infra';

/** An HTTP tab or space is U+0009 TAB or U+0020 SPACE. */
export const HTTPTabOrSpace = unionZ(eq(0x09), eq(0x0020));
export const isHTTPTabOrSpace = (x: number): boolean => HTTPTabOrSpace.has(x);

/** HTTP whitespace is U+000A LF, U+000D CR, or an HTTP tab or space. */
export const HTTPWhitespace = unionZ(eq(0x0A), eq(0x000D), HTTPTabOrSpace);
export const isHTTPWhitespace = (x: number): boolean => HTTPWhitespace.has(x);

/** An HTTP newline byte is 0x0A (LF) or 0x0D (CR). */
export const HTTPNewlineByte = ASCIINewline;
export const isHTTPNewlineByte = isASCIINewline;

/** An HTTP tab or space byte is 0x09 (HT) or 0x20 (SP). */
export const HTTPTabOrSpaceByte = HTTPTabOrSpace;
export const isHTTPTabOrSpaceByte = isHTTPTabOrSpace;

/** An HTTP whitespace byte is an HTTP newline byte or HTTP tab or space byte. */
export const HTTPWhitespaceByte = unionZ(HTTPNewlineByte, HTTPTabOrSpaceByte);
export const isHTTPWhitespaceByte = (x: number): boolean => HTTPWhitespaceByte.has(x);
