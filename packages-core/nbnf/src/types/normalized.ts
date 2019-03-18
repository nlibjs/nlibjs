import {
    IntervalZ,
    SetZ,
} from '@nlib/real-number';

export const enum NBNFNormalizedElementType {
    Group = 'nGroup',
    RuleName = 'nRuleName',
    Sequence = 'nSequence',
    CodePoint = 'nCodePoint',
}
export type INBNFNormalizedGroupElementData = INBNFNormalizedAlternation;
export type INBNFNormalizedRuleNameElementData = string;
export type INBNFNormalizedSequenceElementData = Uint32Array;
export type INBNFNormalizedCodePointElementData = SetZ;
export type INBNFNormalizedElementData =
| INBNFNormalizedGroupElementData
| INBNFNormalizedRuleNameElementData
| INBNFNormalizedSequenceElementData
| INBNFNormalizedCodePointElementData;
export interface INBNFNormalizedElementBase<TType extends NBNFNormalizedElementType, TData extends INBNFNormalizedElementData> {
    type: TType,
    data: TData,
}
export interface INBNFNormalizedGroupElement extends INBNFNormalizedElementBase<NBNFNormalizedElementType.Group, INBNFNormalizedGroupElementData> {}
export interface INBNFNormalizedRuleNameElement extends INBNFNormalizedElementBase<NBNFNormalizedElementType.RuleName, INBNFNormalizedRuleNameElementData> {}
export interface INBNFNormalizedSequenceElement extends INBNFNormalizedElementBase<NBNFNormalizedElementType.Sequence, INBNFNormalizedSequenceElementData> {
    caseSensitive: boolean,
}
export interface INBNFNormalizedCodePointElement extends INBNFNormalizedElementBase<NBNFNormalizedElementType.CodePoint, INBNFNormalizedCodePointElementData> {}
export type INBNFNormalizedElement =
| INBNFNormalizedGroupElement
| INBNFNormalizedRuleNameElement
| INBNFNormalizedSequenceElement
| INBNFNormalizedCodePointElement;
export interface INBNFNormalizedRepetitionBase<TElement extends INBNFNormalizedElement> {
    repeat: IntervalZ,
    element: TElement,
}
export interface INBNFNormalizedGroupRepetition extends INBNFNormalizedRepetitionBase<INBNFNormalizedGroupElement> {}
export interface INBNFNormalizedRuleNameRepetition extends INBNFNormalizedRepetitionBase<INBNFNormalizedRuleNameElement> {}
export interface INBNFNormalizedSequenceRepetition extends INBNFNormalizedRepetitionBase<INBNFNormalizedSequenceElement> {}
export interface INBNFNormalizedCodePointRepetition extends INBNFNormalizedRepetitionBase<INBNFNormalizedCodePointElement> {}
export interface INBNFNormalizedRepetition extends INBNFNormalizedRepetitionBase<INBNFNormalizedElement> {}
export interface INBNFNormalizedConcatenation extends Array<INBNFNormalizedRepetition> {}
export interface INBNFNormalizedAlternation extends Array<INBNFNormalizedConcatenation> {}
export interface INBNFNormalizedRule {
    name: string,
    incremental: boolean,
    elements: INBNFNormalizedAlternation,
}
export interface INBNFNormalizedRuleList {
    [ruleName: string]: INBNFNormalizedAlternation,
}
export interface INBNFNullableNormalizedRuleList {
    [ruleName: string]: INBNFNormalizedAlternation | null,
}
