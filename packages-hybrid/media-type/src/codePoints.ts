import {unionZ, eq, inin} from '@nlib/real-number';
import {ASCIIAlphanumeric, ASCIIWhitespace, isASCIIWhitespace} from '@nlib/infra';

/** An HTTP token code point is
 * U+0021 (!), U+0023 (#), U+0024 ($), U+0025 (%),
 * U+0026 (&), U+0027 ('), U+002A (*), U+002B (+),
 * U+002D (-), U+002E (.), U+005E (^), U+005F (_),
 * U+0060 (`), U+007C (|), U+007E (~), or an ASCII alphanumeric. */
export const HTTPToken = unionZ(
    eq(0x0021), eq(0x0023), eq(0x0024), eq(0x0025),
    eq(0x0026), eq(0x0027), eq(0x002A), eq(0x002B),
    eq(0x002D), eq(0x002E), eq(0x005E), eq(0x005F),
    eq(0x0060), eq(0x007C), eq(0x007E), ASCIIAlphanumeric,
);
export const isHTTPToken = (x: number): boolean => HTTPToken.has(x);

/** An HTTP quoted-string token code point is U+0009 TAB,
 * a code point in the range U+0020 SPACE to U+007E (~), inclusive,
 * or a code point in the range U+0080 through U+00FF (ÿ), inclusive. */
export const HTTPQuotedStringToken = unionZ(eq(0x0009), inin(0x0020, 0x007E), inin(0x0080, 0x00FF));
export const isHTTPQuotedStringToken = (x: number): boolean => HTTPQuotedStringToken.has(x);

/**  binary data byte is a byte in the range 0x00 to 0x08 (NUL to BS),
 * the byte 0x0B (VT), a byte in the range 0x0E to 0x1A (SO to SUB),
 * or a byte in the range 0x1C to 0x1F (FS to US). */
export const BinaryDataByte = unionZ(inin(0x00, 0x08), eq(0x0B), inin(0x0E, 0x1A), inin(0x1C, 0x1F));
export const isBinaryDataByte = (x: number): boolean => BinaryDataByte.has(x);

/** A whitespace byte (abbreviated 0xWS) is any one of the following bytes:
 * 0x09 (HT), 0x0A (LF), 0x0C (FF), 0x0D (CR), 0x20 (SP). */
export const WhitespaceByte = ASCIIWhitespace;
export const isWhitespaceByte = isASCIIWhitespace;

/** A tag-terminating byte (abbreviated 0xTT) is any one of the following bytes:
 * 0x20 (SP), 0x3E (">"). */
export const TagTerminatingByte = unionZ(eq(0x20), eq(0x3E));
export const isTagTerminatingByte = (x: number): boolean => TagTerminatingByte.has(x);
