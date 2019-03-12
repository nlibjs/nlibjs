import {
    SetZ,
    complementSetZ,
    unionSetZ,
    intersectionSetZ,
    hasSetZ,
    fromValuesSetZ,
} from '@nlib/real-number';

export const NULL = 0x0000;
export const START_OF_HEADING = 0x0001;
export const START_OF_TEXT = 0x0002;
export const END_OF_TEXT = 0x0003;
export const END_OF_TRANSMISSION = 0x0004;
export const ENQUIRY = 0x0005;
export const ACKNOWLEDGE = 0x0006;
export const ALERT = 0x0007;
export const BACKSPACE = 0x0008;
export const CHARACTER_TABULATION = 0x0009;
export const LINE_FEED = 0x000A;
export const LINE_TABULATION = 0x000B;
export const FORM_FEED = 0x000C;
export const CARRIAGE_RETURN = 0x000D;
export const SHIFT_OUT = 0x000E;
export const SHIFT_IN = 0x000F;
export const DATA_LINK_ESCAPE = 0x0010;
export const DEVICE_CONTROL_ONE = 0x0011;
export const DEVICE_CONTROL_TWO = 0x0012;
export const DEVICE_CONTROL_THREE = 0x0013;
export const DEVICE_CONTROL_FOUR = 0x0014;
export const NEGATIVE_ACKNOWLEDGE = 0x0015;
export const SYNCHRONOUS_IDLE = 0x0016;
export const END_OF_TRANSMISSION_BLOCK = 0x0017;
export const CANCEL = 0x0018;
export const END_OF_MEDIUM = 0x0019;
export const SUBSTITUTE = 0x001A;
export const ESCAPE = 0x001B;
export const INFORMATION_SEPARATOR_FOUR = 0x001C;
export const INFORMATION_SEPARATOR_THREE = 0x001D;
export const INFORMATION_SEPARATOR_TWO = 0x001E;
export const INFORMATION_SEPARATOR_ONE = 0x001F;
export const SPACE = 0x0020;
export const EXCLAMATION_MARK = 0x0021;
export const QUOTATION_MARK = 0x0022;
export const NUMBER_SIGN = 0x0023;
export const DOLLAR_SIGN = 0x0024;
export const PERCENT_SIGN = 0x0025;
export const AMPERSAND = 0x0026;
export const APOSTROPHE = 0x0027;
export const LEFT_PARENTHESIS = 0x0028;
export const RIGHT_PARENTHESIS = 0x0029;
export const ASTERISK = 0x002A;
export const PLUS_SIGN = 0x002B;
export const COMMA = 0x002C;
export const HYPHEN_MINUS = 0x002D;
export const FULL_STOP = 0x002E;
export const SOLIDUS = 0x002F;
export const DIGIT_ZERO = 0x0030;
export const DIGIT_ONE = 0x0031;
export const DIGIT_TWO = 0x0032;
export const DIGIT_THREE = 0x0033;
export const DIGIT_FOUR = 0x0034;
export const DIGIT_FIVE = 0x0035;
export const DIGIT_SIX = 0x0036;
export const DIGIT_SEVEN = 0x0037;
export const DIGIT_EIGHT = 0x0038;
export const DIGIT_NINE = 0x0039;
export const COLON = 0x003A;
export const SEMICOLON = 0x003B;
export const LESS_THAN_SIGN = 0x003C;
export const EQUALS_SIGN = 0x003D;
export const GREATER_THAN_SIGN = 0x003E;
export const QUESTION_MARK = 0x003F;
export const COMMERCIAL_AT = 0x0040;
export const LATIN_CAPITAL_LETTER_A = 0x0041;
export const LATIN_CAPITAL_LETTER_B = 0x0042;
export const LATIN_CAPITAL_LETTER_C = 0x0043;
export const LATIN_CAPITAL_LETTER_D = 0x0044;
export const LATIN_CAPITAL_LETTER_E = 0x0045;
export const LATIN_CAPITAL_LETTER_F = 0x0046;
export const LATIN_CAPITAL_LETTER_G = 0x0047;
export const LATIN_CAPITAL_LETTER_H = 0x0048;
export const LATIN_CAPITAL_LETTER_I = 0x0049;
export const LATIN_CAPITAL_LETTER_J = 0x004A;
export const LATIN_CAPITAL_LETTER_K = 0x004B;
export const LATIN_CAPITAL_LETTER_L = 0x004C;
export const LATIN_CAPITAL_LETTER_M = 0x004D;
export const LATIN_CAPITAL_LETTER_N = 0x004E;
export const LATIN_CAPITAL_LETTER_O = 0x004F;
export const LATIN_CAPITAL_LETTER_P = 0x0050;
export const LATIN_CAPITAL_LETTER_Q = 0x0051;
export const LATIN_CAPITAL_LETTER_R = 0x0052;
export const LATIN_CAPITAL_LETTER_S = 0x0053;
export const LATIN_CAPITAL_LETTER_T = 0x0054;
export const LATIN_CAPITAL_LETTER_U = 0x0055;
export const LATIN_CAPITAL_LETTER_V = 0x0056;
export const LATIN_CAPITAL_LETTER_W = 0x0057;
export const LATIN_CAPITAL_LETTER_X = 0x0058;
export const LATIN_CAPITAL_LETTER_Y = 0x0059;
export const LATIN_CAPITAL_LETTER_Z = 0x005A;
export const LEFT_SQUARE_BRACKET = 0x005B;
export const REVERSE_SOLIDUS = 0x005C;
export const RIGHT_SQUARE_BRACKET = 0x005D;
export const CIRCUMFLEX_ACCENT = 0x005E;
export const LOW_LINE = 0x005F;
export const GRAVE_ACCENT = 0x0060;
export const LATIN_SMALL_LETTER_A = 0x0061;
export const LATIN_SMALL_LETTER_B = 0x0062;
export const LATIN_SMALL_LETTER_C = 0x0063;
export const LATIN_SMALL_LETTER_D = 0x0064;
export const LATIN_SMALL_LETTER_E = 0x0065;
export const LATIN_SMALL_LETTER_F = 0x0066;
export const LATIN_SMALL_LETTER_G = 0x0067;
export const LATIN_SMALL_LETTER_H = 0x0068;
export const LATIN_SMALL_LETTER_I = 0x0069;
export const LATIN_SMALL_LETTER_J = 0x006A;
export const LATIN_SMALL_LETTER_K = 0x006B;
export const LATIN_SMALL_LETTER_L = 0x006C;
export const LATIN_SMALL_LETTER_M = 0x006D;
export const LATIN_SMALL_LETTER_N = 0x006E;
export const LATIN_SMALL_LETTER_O = 0x006F;
export const LATIN_SMALL_LETTER_P = 0x0070;
export const LATIN_SMALL_LETTER_Q = 0x0071;
export const LATIN_SMALL_LETTER_R = 0x0072;
export const LATIN_SMALL_LETTER_S = 0x0073;
export const LATIN_SMALL_LETTER_T = 0x0074;
export const LATIN_SMALL_LETTER_U = 0x0075;
export const LATIN_SMALL_LETTER_V = 0x0076;
export const LATIN_SMALL_LETTER_W = 0x0077;
export const LATIN_SMALL_LETTER_X = 0x0078;
export const LATIN_SMALL_LETTER_Y = 0x0079;
export const LATIN_SMALL_LETTER_Z = 0x007A;
export const LEFT_CURLY_BRACKET = 0x007B;
export const VERTICAL_LINE = 0x007C;
export const RIGHT_CURLY_BRACKET = 0x007D;
export const TILDE = 0x007E;
export const DELETE = 0x007F;
export const APPLICATION_PROGRAM_COMMAND = 0x009F;

/** A leading surrogate is a code point that is in the range U+D800 to U+DBFF, inclusive. */
export const LeadingSurrogate: SetZ = [[0xD800, 0xDBFF]];
export const isLeadingSurrogate = (x: number): boolean => hasSetZ(LeadingSurrogate, x);

/** A trailing surrogate is a code point that is in the range U+DC00 to U+DFFF, inclusive. */
export const TrailingSurrogate: SetZ = [[0xDC00, 0xDFFF]];
export const isTrailingSurrogate = (x: number): boolean => hasSetZ(TrailingSurrogate, x);

/** A surrogate is a code point that is in the range U+D800 to U+DFFF, inclusive. */
export const Surrogate = unionSetZ(LeadingSurrogate, TrailingSurrogate);
export const isSurrogate = (x: number): boolean => hasSetZ(Surrogate, x);

/** A scalar value is a code point that is not a surrogate. */
export const ScalarValue = complementSetZ(Surrogate);
export const isScalarValue = (x: number): boolean => hasSetZ(ScalarValue, x);

/** A noncharacter is a code point that is in the range
 * U+FDD0 to U+FDEF, inclusive,
 * or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF,
 *    U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF,
 *    U+6FFFE, U+6FFFF, U+7FFFE, U+7FFFF, U+8FFFE, U+8FFFF,
 *    U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE, U+BFFFF,
 *    U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF,
 *    U+FFFFE, U+FFFFF, U+10FFFE, or U+10FFFF. */
export const Noncharacter = fromValuesSetZ(
    0xFDEF,
    0xFFFE, 0xFFFF, 0x1FFFE, 0x1FFFF, 0x2FFFE, 0x2FFFF,
    0x3FFFE, 0x3FFFF, 0x4FFFE, 0x4FFFF, 0x5FFFE, 0x5FFFF,
    0x6FFFE, 0x6FFFF, 0x7FFFE, 0x7FFFF, 0x8FFFE, 0x8FFFF,
    0x9FFFE, 0x9FFFF, 0xAFFFE, 0xAFFFF, 0xBFFFE, 0xBFFFF,
    0xCFFFE, 0xCFFFF, 0xDFFFE, 0xDFFFF, 0xEFFFE, 0xEFFFF,
    0xFFFFE, 0xFFFFF, 0x10FFFE, 0x10FFFF,
);
export const isNoncharacter = (x: number): boolean => hasSetZ(Noncharacter, x);

/** An ASCII code point is a code point in the range U+0000 NULL to U+007F DELETE, inclusive. */
export const ASCIICodePoint: SetZ = [[NULL, DELETE]];
export const isASCIICodePoint = (x: number): boolean => hasSetZ(ASCIICodePoint, x);

/** An ASCII newline is U+000A LF, or U+000D CR. */
export const ASCIINewline = fromValuesSetZ(LINE_FEED, CARRIAGE_RETURN);
export const isASCIINewline = (x: number): boolean => hasSetZ(ASCIINewline, x);

/** An ASCII tab or newline is U+0009 TAB, U+000A LF, or U+000D CR. */
export const ASCIITabOrNewline = unionSetZ(fromValuesSetZ(CHARACTER_TABULATION), ASCIINewline);
export const isASCIITabOrNewline = (x: number): boolean => hasSetZ(ASCIITabOrNewline, x);

/** ASCII whitespace is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE. */
export const ASCIIWhitespace = unionSetZ(ASCIITabOrNewline, fromValuesSetZ(FORM_FEED, SPACE));
export const isASCIIWhitespace = (x: number): boolean => hasSetZ(ASCIIWhitespace, x);

/** ASCII nonnewline whitespace is U+0009 TAB, U+000C FF or U+0020 SPACE. */
export const ASCIINonNewlineWhitespace = intersectionSetZ(ASCIIWhitespace, complementSetZ(ASCIINewline));
export const isASCIINonNewlineWhitespace = (x: number): boolean => hasSetZ(ASCIINonNewlineWhitespace, x);

/** A C0 control is a code point in the range U+0000 NULL to U+001F INFORMATION SEPARATOR ONE, inclusive. */
export const C0Control: SetZ = [[NULL, INFORMATION_SEPARATOR_ONE]];
export const isC0Control = (x: number): boolean => hasSetZ(C0Control, x);

/** A C0 control or space is a C0 control or U+0020 SPACE. */
export const C0ControlOrSpace = unionSetZ(C0Control, fromValuesSetZ(SPACE));
export const isC0ControlOrSpace = (x: number): boolean => hasSetZ(C0ControlOrSpace, x);

/** A control is a C0 control or a code point in the range U+007F DELETE to U+009F APPLICATION PROGRAM COMMAND, inclusive. */
export const Control = unionSetZ(C0Control, [[DELETE, APPLICATION_PROGRAM_COMMAND]]);
export const isControl = (x: number): boolean => hasSetZ(Control, x);

/** An ASCII digit is a code point in the range U+0030 (0) to U+0039 (9), inclusive. */
export const ASCIIDigit: SetZ = [[0x0030, 0x0039]];
export const isASCIIDigit = (x: number): boolean => hasSetZ(ASCIIDigit, x);

/** An ASCII upper hex digit is an ASCII digit or a code point in the range U+0041 (A) to U+0046 (F), inclusive. */
export const ASCIIUpperHexDigit = unionSetZ(ASCIIDigit, [[0x0041, 0x0046]]);
export const isASCIIUpperHexDigit = (x: number): boolean => hasSetZ(ASCIIUpperHexDigit, x);

/** An ASCII lower hex digit is an ASCII digit or a code point in the range U+0061 (a) to U+0066 (f), inclusive. */
export const ASCIILowerHexDigit = unionSetZ(ASCIIDigit, [[0x0061, 0x0066]]);
export const isASCIILowerHexDigit = (x: number): boolean => hasSetZ(ASCIILowerHexDigit, x);

/** An ASCII hex digit is an ASCII upper hex digit or ASCII lower hex digit. */
export const ASCIIHexDigit = unionSetZ(ASCIIUpperHexDigit, ASCIILowerHexDigit);
export const isASCIIHexDigit = (x: number): boolean => hasSetZ(ASCIIHexDigit, x);

/** An ASCII upper alpha is a code point in the range U+0041 (A) to U+005A (Z), inclusive. */
export const ASCIIUpperAlpha: SetZ = [[0x0041, 0x005A]];
export const isASCIIUpperAlpha = (x: number): boolean => hasSetZ(ASCIIUpperAlpha, x);

/** An ASCII lower alpha is a code point in the range U+0061 (a) to U+007A (z), inclusive. */
export const ASCIILowerAlpha: SetZ = [[0x0061, 0x007A]];
export const isASCIILowerAlpha = (x: number): boolean => hasSetZ(ASCIILowerAlpha, x);

/** An ASCII alpha is an ASCII upper alpha or ASCII lower alpha. */
export const ASCIIAlpha = unionSetZ(ASCIIUpperAlpha, ASCIILowerAlpha);
export const isASCIIAlpha = (x: number): boolean => hasSetZ(ASCIIAlpha, x);

/** An ASCII alphanumeric is an ASCII digit or ASCII alpha. */
export const ASCIIAlphanumeric = unionSetZ(ASCIIDigit, ASCIIAlpha);
export const isASCIIAlphanumeric = (x: number): boolean => hasSetZ(ASCIIAlphanumeric, x);
