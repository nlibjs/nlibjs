import {IntervalZ, SetZ} from '@nlib/real-number';

export const enum NBNFElementType {
    Option = 'Option',
    Group = 'Group',
    RuleName = 'RuleName',
    Sequence = 'Sequence',
    CodePoint = 'CodePoint',
}
export type INBNFOptionElementData = INBNFAlternation;
export type INBNFGroupElementData = INBNFAlternation;
export type INBNFRuleNameElementData = string;
export type INBNFSequenceElementData = Uint32Array;
export type INBNFCodePointElementData = SetZ;
export type INBNFElementData =
| INBNFOptionElementData
| INBNFGroupElementData
| INBNFRuleNameElementData
| INBNFSequenceElementData
| INBNFCodePointElementData;
export interface INBNFElementBase<TType extends NBNFElementType, TData extends INBNFElementData> {
    type: TType,
    data: TData,
}
export interface INBNFOptionElement extends INBNFElementBase<NBNFElementType.Option, INBNFOptionElementData> {}
export interface INBNFGroupElement extends INBNFElementBase<NBNFElementType.Group, INBNFGroupElementData> {}
export interface INBNFRuleNameElement extends INBNFElementBase<NBNFElementType.RuleName, INBNFRuleNameElementData> {}
export interface INBNFSequenceElement extends INBNFElementBase<NBNFElementType.Sequence, INBNFSequenceElementData> {
    caseSensitive: boolean,
}
export interface INBNFCodePointElement extends INBNFElementBase<NBNFElementType.CodePoint, INBNFCodePointElementData> {}
export type INBNFElement =
| INBNFOptionElement
| INBNFGroupElement
| INBNFRuleNameElement
| INBNFSequenceElement
| INBNFCodePointElement;
export interface INBNFRepetitionBase<TElement extends INBNFElement> {
    repeat: IntervalZ,
    element: TElement,
}
export interface INBNFOptionRepetition extends INBNFRepetitionBase<INBNFOptionElement> {}
export interface INBNFGroupRepetition extends INBNFRepetitionBase<INBNFGroupElement> {}
export interface INBNFRuleNameRepetition extends INBNFRepetitionBase<INBNFRuleNameElement> {}
export interface INBNFSequenceRepetition extends INBNFRepetitionBase<INBNFSequenceElement> {}
export interface INBNFCodePointRepetition extends INBNFRepetitionBase<INBNFCodePointElement> {}
export interface INBNFRepetition extends INBNFRepetitionBase<INBNFElement> {}

export interface INBNFConcatenation extends Array<INBNFRepetition> {}
export interface INBNFAlternation extends Array<INBNFConcatenation> {}
export interface INBNFRule {
    name: string,
    incremental: boolean,
    elements: INBNFAlternation,
}
export interface INBNFRuleList {
    [ruleName: string]: INBNFAlternation,
}
