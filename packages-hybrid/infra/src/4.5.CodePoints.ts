import {inin, eq, fromIntervalZ, complementZ, unionZ} from '@nlib/real-number';
import {CodePoint} from './types';

/** A leading surrogate is a code point that is in the range U+D800 to U+DBFF, inclusive. */
export const LeadingSurrogate = fromIntervalZ(inin(0xD800, 0xDBFF));
export const isLeadingSurrogate = (x: number): boolean => LeadingSurrogate.has(x);

/** A trailing surrogate is a code point that is in the range U+DC00 to U+DFFF, inclusive. */
export const TrailingSurrogate = fromIntervalZ(inin(0xDC00, 0xDFFF));
export const isTrailingSurrogate = (x: number): boolean => TrailingSurrogate.has(x);

/** A surrogate is a code point that is in the range U+D800 to U+DFFF, inclusive. */
export const Surrogate = unionZ(LeadingSurrogate, TrailingSurrogate);
export const isSurrogate = (x: number): boolean => Surrogate.has(x);

/** A scalar value is a code point that is not a surrogate. */
export const ScalarValue = complementZ(Surrogate);
export const isScalarValue = (x: number): boolean => ScalarValue.has(x);

/** A noncharacter is a code point that is in the range
 * U+FDD0 to U+FDEF, inclusive,
 * or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF,
 *    U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF,
 *    U+6FFFE, U+6FFFF, U+7FFFE, U+7FFFF, U+8FFFE, U+8FFFF,
 *    U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE, U+BFFFF,
 *    U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF,
 *    U+FFFFE, U+FFFFF, U+10FFFE, or U+10FFFF. */
export const Noncharacter = unionZ(
    eq(0xFDEF),
    eq(0xFFFE), eq(0xFFFF), eq(0x1FFFE), eq(0x1FFFF), eq(0x2FFFE), eq(0x2FFFF),
    eq(0x3FFFE), eq(0x3FFFF), eq(0x4FFFE), eq(0x4FFFF), eq(0x5FFFE), eq(0x5FFFF),
    eq(0x6FFFE), eq(0x6FFFF), eq(0x7FFFE), eq(0x7FFFF), eq(0x8FFFE), eq(0x8FFFF),
    eq(0x9FFFE), eq(0x9FFFF), eq(0xAFFFE), eq(0xAFFFF), eq(0xBFFFE), eq(0xBFFFF),
    eq(0xCFFFE), eq(0xCFFFF), eq(0xDFFFE), eq(0xDFFFF), eq(0xEFFFE), eq(0xEFFFF),
    eq(0xFFFFE), eq(0xFFFFF), eq(0x10FFFE), eq(0x10FFFF),
);
export const isNoncharacter = (x: number): boolean => Noncharacter.has(x);

/** An ASCII code point is a code point in the range U+0000 NULL to U+007F DELETE, inclusive. */
export const NULL = 0x0000 as CodePoint;
export const DELETE = 0x007F as CodePoint;
export const ASCIICodePoint = fromIntervalZ(inin(NULL, DELETE));
export const isASCIICodePoint = (x: number): boolean => ASCIICodePoint.has(x);

/** An ASCII newline is U+000A LF, or U+000D CR. */
export const LF = 0x000A as CodePoint;
export const CR = 0x000D as CodePoint;
export const ASCIINewline = unionZ(eq(LF), eq(CR));
export const isASCIINewline = (x: number): boolean => ASCIINewline.has(x);

/** An ASCII tab or newline is U+0009 TAB, U+000A LF, or U+000D CR. */
export const TAB = 0x0009 as CodePoint;
export const ASCIITabOrNewline = unionZ(
    eq(TAB),
    ASCIINewline,
);
export const isASCIITabOrNewline = (x: number): boolean => ASCIITabOrNewline.has(x);

export const FF = 0x000C as CodePoint;
export const SPACE = 0x0020 as CodePoint;
/** ASCII whitespace is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE. */
export const ASCIIWhitespace = unionZ(
    ASCIITabOrNewline,
    eq(FF),
    eq(SPACE),
);
export const isASCIIWhitespace = (x: number): boolean => ASCIIWhitespace.has(x);

/** A C0 control is a code point in the range U+0000 NULL to U+001F INFORMATION SEPARATOR ONE, inclusive. */
export const INFORMATION_SEPARATOR_ONE = 0x001F as CodePoint;
export const C0Control = fromIntervalZ(inin(NULL, INFORMATION_SEPARATOR_ONE));
export const isC0Control = (x: number): boolean => C0Control.has(x);

/** A C0 control or space is a C0 control or U+0020 SPACE. */
export const C0ControlOrSpace = unionZ(C0Control, eq(SPACE));
export const isC0ControlOrSpace = (x: number): boolean => C0ControlOrSpace.has(x);

/** A control is a C0 control or a code point in the range U+007F DELETE to U+009F APPLICATION PROGRAM COMMAND, inclusive. */
export const APPLICATION_PROGRAM_COMMAND = 0x009F as CodePoint;
export const Control = unionZ(C0Control, inin(DELETE, APPLICATION_PROGRAM_COMMAND));
export const isControl = (x: number): boolean => Control.has(x);

/** An ASCII digit is a code point in the range U+0030 (0) to U+0039 (9), inclusive. */
export const ASCIIDigit = fromIntervalZ(inin(0x0030, 0x0039));
export const isASCIIDigit = (x: number): boolean => ASCIIDigit.has(x);

/** An ASCII upper hex digit is an ASCII digit or a code point in the range U+0041 (A) to U+0046 (F), inclusive. */
export const ASCIIUpperHexDigit = unionZ(ASCIIDigit, inin(0x0041, 0x0046));
export const isASCIIUpperHexDigit = (x: number): boolean => ASCIIUpperHexDigit.has(x);

/** An ASCII lower hex digit is an ASCII digit or a code point in the range U+0061 (a) to U+0066 (f), inclusive. */
export const ASCIILowerHexDigit = unionZ(ASCIIDigit, inin(0x0061, 0x0066));
export const isASCIILowerHexDigit = (x: number): boolean => ASCIILowerHexDigit.has(x);

/** An ASCII hex digit is an ASCII upper hex digit or ASCII lower hex digit. */
export const ASCIIHexDigit = unionZ(ASCIIUpperHexDigit, ASCIILowerHexDigit);
export const isASCIIHexDigit = (x: number): boolean => ASCIIHexDigit.has(x);

/** An ASCII upper alpha is a code point in the range U+0041 (A) to U+005A (Z), inclusive. */
export const ASCIIUpperAlpha = fromIntervalZ(inin(0x0041, 0x005A));
export const isASCIIUpperAlpha = (x: number): boolean => ASCIIUpperAlpha.has(x);

/** An ASCII lower alpha is a code point in the range U+0061 (a) to U+007A (z), inclusive. */
export const ASCIILowerAlpha = fromIntervalZ(inin(0x0061, 0x007A));
export const isASCIILowerAlpha = (x: number): boolean => ASCIILowerAlpha.has(x);

/** An ASCII alpha is an ASCII upper alpha or ASCII lower alpha. */
export const ASCIIAlpha = unionZ(ASCIIUpperAlpha, ASCIILowerAlpha);
export const isASCIIAlpha = (x: number): boolean => ASCIIAlpha.has(x);

/** An ASCII alphanumeric is an ASCII digit or ASCII alpha. */
export const ASCIIAlphanumeric = unionZ(ASCIIDigit, ASCIIAlpha);
export const isASCIIAlphanumeric = (x: number): boolean => ASCIIAlphanumeric.has(x);
