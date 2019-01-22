import {inin, eq, fromIntervalZ, complementZ, unionZ, intersectionZ} from '@nlib/real-number';
import {CodePoint} from './types';

export const NULL = 0x0000 as CodePoint;
export const START_OF_HEADING = 0x0001 as CodePoint;
export const START_OF_TEXT = 0x0002 as CodePoint;
export const END_OF_TEXT = 0x0003 as CodePoint;
export const END_OF_TRANSMISSION = 0x0004 as CodePoint;
export const ENQUIRY = 0x0005 as CodePoint;
export const ACKNOWLEDGE = 0x0006 as CodePoint;
export const ALERT = 0x0007 as CodePoint;
export const BACKSPACE = 0x0008 as CodePoint;
export const CHARACTER_TABULATION = 0x0009 as CodePoint;
export const LINE_FEED = 0x000A as CodePoint;
export const LINE_TABULATION = 0x000B as CodePoint;
export const FORM_FEED = 0x000C as CodePoint;
export const CARRIAGE_RETURN = 0x000D as CodePoint;
export const SHIFT_OUT = 0x000E as CodePoint;
export const SHIFT_IN = 0x000F as CodePoint;
export const DATA_LINK_ESCAPE = 0x0010 as CodePoint;
export const DEVICE_CONTROL_ONE = 0x0011 as CodePoint;
export const DEVICE_CONTROL_TWO = 0x0012 as CodePoint;
export const DEVICE_CONTROL_THREE = 0x0013 as CodePoint;
export const DEVICE_CONTROL_FOUR = 0x0014 as CodePoint;
export const NEGATIVE_ACKNOWLEDGE = 0x0015 as CodePoint;
export const SYNCHRONOUS_IDLE = 0x0016 as CodePoint;
export const END_OF_TRANSMISSION_BLOCK = 0x0017 as CodePoint;
export const CANCEL = 0x0018 as CodePoint;
export const END_OF_MEDIUM = 0x0019 as CodePoint;
export const SUBSTITUTE = 0x001A as CodePoint;
export const ESCAPE = 0x001B as CodePoint;
export const INFORMATION_SEPARATOR_FOUR = 0x001C as CodePoint;
export const INFORMATION_SEPARATOR_THREE = 0x001D as CodePoint;
export const INFORMATION_SEPARATOR_TWO = 0x001E as CodePoint;
export const INFORMATION_SEPARATOR_ONE = 0x001F as CodePoint;
export const SPACE = 0x0020 as CodePoint;
export const EXCLAMATION_MARK = 0x0021 as CodePoint;
export const QUOTATION_MARK = 0x0022 as CodePoint;
export const NUMBER_SIGN = 0x0023 as CodePoint;
export const DOLLAR_SIGN = 0x0024 as CodePoint;
export const PERCENT_SIGN = 0x0025 as CodePoint;
export const AMPERSAND = 0x0026 as CodePoint;
export const APOSTROPHE = 0x0027 as CodePoint;
export const LEFT_PARENTHESIS = 0x0028 as CodePoint;
export const RIGHT_PARENTHESIS = 0x0029 as CodePoint;
export const ASTERISK = 0x002A as CodePoint;
export const PLUS_SIGN = 0x002B as CodePoint;
export const COMMA = 0x002C as CodePoint;
export const HYPHEN_MINUS = 0x002D as CodePoint;
export const FULL_STOP = 0x002E as CodePoint;
export const SOLIDUS = 0x002F as CodePoint;
export const DIGIT_ZERO = 0x0030 as CodePoint;
export const DIGIT_ONE = 0x0031 as CodePoint;
export const DIGIT_TWO = 0x0032 as CodePoint;
export const DIGIT_THREE = 0x0033 as CodePoint;
export const DIGIT_FOUR = 0x0034 as CodePoint;
export const DIGIT_FIVE = 0x0035 as CodePoint;
export const DIGIT_SIX = 0x0036 as CodePoint;
export const DIGIT_SEVEN = 0x0037 as CodePoint;
export const DIGIT_EIGHT = 0x0038 as CodePoint;
export const DIGIT_NINE = 0x0039 as CodePoint;
export const COLON = 0x003A as CodePoint;
export const SEMICOLON = 0x003B as CodePoint;
export const LESS_THAN_SIGN = 0x003C as CodePoint;
export const EQUALS_SIGN = 0x003D as CodePoint;
export const GREATER_THAN_SIGN = 0x003E as CodePoint;
export const QUESTION_MARK = 0x003F as CodePoint;
export const COMMERCIAL_AT = 0x0040 as CodePoint;
export const LATIN_CAPITAL_LETTER_A = 0x0041 as CodePoint;
export const LATIN_CAPITAL_LETTER_B = 0x0042 as CodePoint;
export const LATIN_CAPITAL_LETTER_C = 0x0043 as CodePoint;
export const LATIN_CAPITAL_LETTER_D = 0x0044 as CodePoint;
export const LATIN_CAPITAL_LETTER_E = 0x0045 as CodePoint;
export const LATIN_CAPITAL_LETTER_F = 0x0046 as CodePoint;
export const LATIN_CAPITAL_LETTER_G = 0x0047 as CodePoint;
export const LATIN_CAPITAL_LETTER_H = 0x0048 as CodePoint;
export const LATIN_CAPITAL_LETTER_I = 0x0049 as CodePoint;
export const LATIN_CAPITAL_LETTER_J = 0x004A as CodePoint;
export const LATIN_CAPITAL_LETTER_K = 0x004B as CodePoint;
export const LATIN_CAPITAL_LETTER_L = 0x004C as CodePoint;
export const LATIN_CAPITAL_LETTER_M = 0x004D as CodePoint;
export const LATIN_CAPITAL_LETTER_N = 0x004E as CodePoint;
export const LATIN_CAPITAL_LETTER_O = 0x004F as CodePoint;
export const LATIN_CAPITAL_LETTER_P = 0x0050 as CodePoint;
export const LATIN_CAPITAL_LETTER_Q = 0x0051 as CodePoint;
export const LATIN_CAPITAL_LETTER_R = 0x0052 as CodePoint;
export const LATIN_CAPITAL_LETTER_S = 0x0053 as CodePoint;
export const LATIN_CAPITAL_LETTER_T = 0x0054 as CodePoint;
export const LATIN_CAPITAL_LETTER_U = 0x0055 as CodePoint;
export const LATIN_CAPITAL_LETTER_V = 0x0056 as CodePoint;
export const LATIN_CAPITAL_LETTER_W = 0x0057 as CodePoint;
export const LATIN_CAPITAL_LETTER_X = 0x0058 as CodePoint;
export const LATIN_CAPITAL_LETTER_Y = 0x0059 as CodePoint;
export const LATIN_CAPITAL_LETTER_Z = 0x005A as CodePoint;
export const LEFT_SQUARE_BRACKET = 0x005B as CodePoint;
export const REVERSE_SOLIDUS = 0x005C as CodePoint;
export const RIGHT_SQUARE_BRACKET = 0x005D as CodePoint;
export const CIRCUMFLEX_ACCENT = 0x005E as CodePoint;
export const LOW_LINE = 0x005F as CodePoint;
export const GRAVE_ACCENT = 0x0060 as CodePoint;
export const LATIN_SMALL_LETTER_A = 0x0061 as CodePoint;
export const LATIN_SMALL_LETTER_B = 0x0062 as CodePoint;
export const LATIN_SMALL_LETTER_C = 0x0063 as CodePoint;
export const LATIN_SMALL_LETTER_D = 0x0064 as CodePoint;
export const LATIN_SMALL_LETTER_E = 0x0065 as CodePoint;
export const LATIN_SMALL_LETTER_F = 0x0066 as CodePoint;
export const LATIN_SMALL_LETTER_G = 0x0067 as CodePoint;
export const LATIN_SMALL_LETTER_H = 0x0068 as CodePoint;
export const LATIN_SMALL_LETTER_I = 0x0069 as CodePoint;
export const LATIN_SMALL_LETTER_J = 0x006A as CodePoint;
export const LATIN_SMALL_LETTER_K = 0x006B as CodePoint;
export const LATIN_SMALL_LETTER_L = 0x006C as CodePoint;
export const LATIN_SMALL_LETTER_M = 0x006D as CodePoint;
export const LATIN_SMALL_LETTER_N = 0x006E as CodePoint;
export const LATIN_SMALL_LETTER_O = 0x006F as CodePoint;
export const LATIN_SMALL_LETTER_P = 0x0070 as CodePoint;
export const LATIN_SMALL_LETTER_Q = 0x0071 as CodePoint;
export const LATIN_SMALL_LETTER_R = 0x0072 as CodePoint;
export const LATIN_SMALL_LETTER_S = 0x0073 as CodePoint;
export const LATIN_SMALL_LETTER_T = 0x0074 as CodePoint;
export const LATIN_SMALL_LETTER_U = 0x0075 as CodePoint;
export const LATIN_SMALL_LETTER_V = 0x0076 as CodePoint;
export const LATIN_SMALL_LETTER_W = 0x0077 as CodePoint;
export const LATIN_SMALL_LETTER_X = 0x0078 as CodePoint;
export const LATIN_SMALL_LETTER_Y = 0x0079 as CodePoint;
export const LATIN_SMALL_LETTER_Z = 0x007A as CodePoint;
export const LEFT_CURLY_BRACKET = 0x007B as CodePoint;
export const VERTICAL_LINE = 0x007C as CodePoint;
export const RIGHT_CURLY_BRACKET = 0x007D as CodePoint;
export const TILDE = 0x007E as CodePoint;
export const DELETE = 0x007F as CodePoint;
export const APPLICATION_PROGRAM_COMMAND = 0x009F;

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
export const ASCIICodePoint = fromIntervalZ(inin(NULL, DELETE));
export const isASCIICodePoint = (x: number): boolean => ASCIICodePoint.has(x);

/** An ASCII newline is U+000A LF, or U+000D CR. */
export const ASCIINewline = unionZ(eq(LINE_FEED), eq(CARRIAGE_RETURN));
export const isASCIINewline = (x: number): boolean => ASCIINewline.has(x);

/** An ASCII tab or newline is U+0009 TAB, U+000A LF, or U+000D CR. */
export const ASCIITabOrNewline = unionZ(eq(CHARACTER_TABULATION), ASCIINewline);
export const isASCIITabOrNewline = (x: number): boolean => ASCIITabOrNewline.has(x);

/** ASCII whitespace is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE. */
export const ASCIIWhitespace = unionZ(ASCIITabOrNewline, eq(FORM_FEED), eq(SPACE));
export const isASCIIWhitespace = (x: number): boolean => ASCIIWhitespace.has(x);

/** ASCII nonnewline whitespace is U+0009 TAB, U+000C FF or U+0020 SPACE. */
export const ASCIINonNewlineWhitespace = intersectionZ(ASCIIWhitespace, complementZ(ASCIINewline));
export const isASCIINonNewlineWhitespace = (x: number): boolean => ASCIINonNewlineWhitespace.has(x);

/** A C0 control is a code point in the range U+0000 NULL to U+001F INFORMATION SEPARATOR ONE, inclusive. */
export const C0Control = fromIntervalZ(inin(NULL, INFORMATION_SEPARATOR_ONE));
export const isC0Control = (x: number): boolean => C0Control.has(x);

/** A C0 control or space is a C0 control or U+0020 SPACE. */
export const C0ControlOrSpace = unionZ(C0Control, eq(SPACE));
export const isC0ControlOrSpace = (x: number): boolean => C0ControlOrSpace.has(x);

/** A control is a C0 control or a code point in the range U+007F DELETE to U+009F APPLICATION PROGRAM COMMAND, inclusive. */
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
