import {IntervalZ, SetZ} from '@nlib/real-number';

export const enum NBNFCompiledElementType {
    Group = 'cGroup',
    Rule = 'cRule',
    Sequence = 'cSequence',
    CodePoint = 'cCodePoint',
}

export type INBNFCompiledGroupElementData = INBNFCompiledAlternation;
export interface INBNFCompiledRuleElementData {
    name: string,
    elements: INBNFCompiledAlternation,
}
export type INBNFCompiledSequenceElementData = Uint32Array;
export type INBNFCompiledCodePointElementData = SetZ;
export type INBNFCompiledElementData =
| INBNFCompiledRuleElementData
| INBNFCompiledGroupElementData
| INBNFCompiledSequenceElementData
| INBNFCompiledCodePointElementData;

export interface INBFCompiledElementBase<TType extends NBNFCompiledElementType, TData extends INBNFCompiledElementData> {
    type: TType,
    data: TData,
}
export interface INBNFCompiledGroupElement extends INBFCompiledElementBase<NBNFCompiledElementType.Group, INBNFCompiledGroupElementData> {}
export interface INBNFCompiledRuleElement extends INBFCompiledElementBase<NBNFCompiledElementType.Rule, INBNFCompiledRuleElementData> {}
export interface INBNFCompiledSequenceElement extends INBFCompiledElementBase<NBNFCompiledElementType.Sequence, INBNFCompiledSequenceElementData> {
    caseSensitive: boolean,
}
export interface INBNFCompiledCodePointElement extends INBFCompiledElementBase<NBNFCompiledElementType.CodePoint, INBNFCompiledCodePointElementData> {}
export type INBNFCompiledElement =
| INBNFCompiledRuleElement
| INBNFCompiledGroupElement
| INBNFCompiledSequenceElement
| INBNFCompiledCodePointElement;

export interface INBNFCompiledRepetitionBase<TElement extends INBNFCompiledElement> {
    repeat: IntervalZ,
    element: TElement,
}
export interface INBNFCompiledGroupRepetition extends INBNFCompiledRepetitionBase<INBNFCompiledGroupElement> {}
export interface INBNFCompiledRuleRepetition extends INBNFCompiledRepetitionBase<INBNFCompiledRuleElement> {}
export interface INBNFCompiledSequenceRepetition extends INBNFCompiledRepetitionBase<INBNFCompiledSequenceElement> {}
export interface INBNFCompiledCodePointRepetition extends INBNFCompiledRepetitionBase<INBNFCompiledCodePointElement> {}
export interface INBNFCompiledRepetition extends INBNFCompiledRepetitionBase<INBNFCompiledElement> {}

export interface INBNFCompiledConcatenation extends Array<INBNFCompiledRepetition> {}
export interface INBNFCompiledAlternation extends Array<INBNFCompiledConcatenation> {}
export interface INBNFCompiledRuleList {
    [ruleName: string]: INBNFCompiledAlternation | undefined,
}
