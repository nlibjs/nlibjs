import {unionSetZ, fromValuesSetZ, hasSetZ} from '@nlib/real-number';
import {
    SEMICOLON,
    SOLIDUS,
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
    ASTERISK,
    QUOTATION_MARK,
    EQUALS_SIGN,
    PERCENT_SIGN,
    SPACE,
    CHARACTER_TABULATION,
    DIGIT_ZERO,
    DIGIT_ONE,
    Control,
    Noncharacter,
    ASCIIWhitespace,
    ASCIIDigit,
} from '@nlib/infra';

export const WSP = fromValuesSetZ(SPACE, CHARACTER_TABULATION);

export const isWSP = (x: number): boolean => hasSetZ(WSP, x);

export const ABNFToken = fromValuesSetZ(
    SEMICOLON,
    SOLIDUS,
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
);

export const isABNFToken = (x: number): boolean => hasSetZ(ABNFToken, x);

export const BIT = fromValuesSetZ(
    DIGIT_ZERO,
    DIGIT_ONE,
);

export const isBIT = (x: number): boolean => hasSetZ(BIT, x);

export const NotRuleNameCharacter = unionSetZ(
    Noncharacter,
    Control,
    ABNFToken,
    ASCIIWhitespace,
);

export const isNotRuleNameCharacter = (x: number): boolean => hasSetZ(NotRuleNameCharacter, x);

export const NotRuleNameFirstCharacter = unionSetZ(
    NotRuleNameCharacter,
    ASCIIDigit,
    fromValuesSetZ(
        ASTERISK,
        QUOTATION_MARK,
        EQUALS_SIGN,
        PERCENT_SIGN,
    ),
);

export const isNotRuleNameFirstCharacter = (x: number): boolean => hasSetZ(NotRuleNameFirstCharacter, x);
