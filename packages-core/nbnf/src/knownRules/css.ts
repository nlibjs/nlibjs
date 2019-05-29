import {
    ASTERISK,
    SOLIDUS,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
    APOSTROPHE,
} from '@nlib/infra';
import {
    intersectionSetZ,
    complementSetZ,
    fromValuesSetZ,
    SetZ,
    unionSetZ,
} from '@nlib/real-number';
import {normalizeNBNF} from '../normalizeNBNF';
import {NBNFNormalizedElementType} from '../types';
import {normalizeRuleList} from '../normalize';

const AnythingSet: SetZ = [[0, 0x10FFFF]];
const AnythingButAsteriskSet = intersectionSetZ(AnythingSet, complementSetZ(fromValuesSetZ(ASTERISK)));
const AnythingButSolidusSet = intersectionSetZ(AnythingSet, complementSetZ(fromValuesSetZ(SOLIDUS)));
const NonASCIISet: SetZ = [[0x81, 0x10FFFF]];
const NewLineSet = fromValuesSetZ(0x0D, 0x0A, 0x0C);
const HexDigitSet: SetZ = [
    [0x30, 0x39],
    [0x41, 0x46],
    [0x61, 0x66],
];
const NotNewLineOrHexDigitSet = complementSetZ(unionSetZ(NewLineSet, HexDigitSet));
const DoubleQuotedStringTokenCharacterSet = complementSetZ(unionSetZ(fromValuesSetZ(QUOTATION_MARK), fromValuesSetZ(REVERSE_SOLIDUS), NewLineSet));
const SingleQuotedStringTokenCharacterSet = complementSetZ(unionSetZ(fromValuesSetZ(APOSTROPHE), fromValuesSetZ(REVERSE_SOLIDUS), NewLineSet));
// https://drafts.csswg.org/css-syntax-3/#token-diagrams

export let CSSAtomicRules = normalizeNBNF(`
Number                  = Integer [Fraction] / Fraction
Integer                 = ["-"] ("0" / NonZero *Digit)
Fraction                = "." 1*Digit
NonZero                 = %x31-39
Digit                   = %x30-39
UpperAlphabet           = %x41-5A
LowerAlphabet           = %x61-7A
Comment                 = "/*" *(AnythingButAsterisk / "*" AnythingButSolidus) "*/"
NewLine                 = %xD.A / %xD / %xA / %xC
WSP                     = %x20 / %x9
WhiteSpace              = WSP / NewLine
HexDigit                = %x30-39 / %x61-66 / %x41-46
Escape                  = "\\\\" (NotNewLineOrHexDigit / 1*6HexDigit [WhiteSpace])
WhiteSpaceToken         = 1*WhiteSpace
StringToken             = "\\"" DoubleQuotedStringToken "\\"" / "'" SingleQuotedStringToken "'"
DoubleQuotedStringToken = *(DoubleQuotedStringTokenCharacter / Escape / "\\\\" NewLine)
SingleQuotedStringToken = *(SingleQuotedStringTokenCharacter / Escape / "\\\\" NewLine)
IdentToken              = ("--" / (["-"] ("_" / UpperAlphabet / LowerAlphabet / NonASCII / Escape))) *("-" / "_" / UpperAlphabet / LowerAlphabet / Digit / NonASCII / Escape)
`, {
    includes: {},
    expands: {
        Anything: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: AnythingSet},
                },
            ],
        ],
        AnythingButAsterisk: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: AnythingButAsteriskSet},
                },
            ],
        ],
        AnythingButSolidus: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: AnythingButSolidusSet},
                },
            ],
        ],
        NotNewLineOrHexDigit: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: NotNewLineOrHexDigitSet},
                },
            ],
        ],
        DoubleQuotedStringTokenCharacter: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: DoubleQuotedStringTokenCharacterSet},
                },
            ],
        ],
        SingleQuotedStringTokenCharacter: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: SingleQuotedStringTokenCharacterSet},
                },
            ],
        ],
        NonASCII: [
            [
                {
                    repeat: [1, 1],
                    element: {type: NBNFNormalizedElementType.CodePoint, data: NonASCIISet},
                },
            ],
        ],
    },
});

CSSAtomicRules = normalizeRuleList(CSSAtomicRules, CSSAtomicRules);

export const CSSBaseRules = normalizeNBNF(`
Time      = TimeValue TimeUnit
TimeValue = Number
TimeUnit  = "s" / "ms"
`, {
    expands: CSSAtomicRules,
});

export const CSSAnimationRules = normalizeNBNF(`
SingleAnimation                     = SingleAnimationProperty *(*WSP SingleAnimationProperty)
SingleAnimationProperty             = Time / EasingFunction / Time / SingleAnimationIterationCount / SingleAnimationDirection / SingleAnimationFillMode / SingleAnimationPlayState / ("none" / KeyframesName)
EasingFunction                      = "linear" / CubicBezierEasingFunction / StepEasingFunction
CubicBezierEasingFunction           = "ease-in-out" / "ease-in" / "ease-out" / "ease" / CubicBezierEasingFunctionExpression
CubicBezierEasingFunctionExpression = CubicBezierEasingFunctionPrefix
                                      CubicBezierEasingFunctionCoordinate
                                      CommaSeparator
                                      CubicBezierEasingFunctionCoordinate
                                      CommaSeparator
                                      CubicBezierEasingFunctionCoordinate
                                      CommaSeparator
                                      CubicBezierEasingFunctionCoordinate
                                      CubicBezierEasingFunctionSuffix
CubicBezierEasingFunctionPrefix     = "cubic-bezier(" *WSP
CubicBezierEasingFunctionSuffix     = *WSP ")"
CubicBezierEasingFunctionCoordinate = Number
StepEasingFunction                  = "step-start" / "step-end" / StepEasingFunctionExpression
StepEasingFunctionExpression        = StepEasingFunctionExpressionPrefix StepEasingFunctionStepCount [CommaSeparator StepPosition] StepEasingFunctionExpressionSuffix
StepEasingFunctionExpressionPrefix  = "steps(" *WSP
StepEasingFunctionExpressionSuffix  = *WSP ")"
StepEasingFunctionStepCount         = Integer
StepPosition                        = "jump-start" / "jump-end" / "jump-none" / "jump-both" / "start" / "end"
CommaSeparator                      = *WSP "," *WSP
SingleAnimationIterationCount       = "infinite" / Number
SingleAnimationDirection            = "normal" / "reverse" / "alternate-reverse" / "alternate"
SingleAnimationFillMode             = "none" / "forwards" / "backwards" / "both"
SingleAnimationPlayState            = "running" / "paused"
KeyframesName                       = CustomIdent / StringToken
CustomIdent                         = IdentToken
`, {
    includes: CSSBaseRules,
    expands: CSSAtomicRules,
});
