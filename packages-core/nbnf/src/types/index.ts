import {PositionCallback} from '@nlib/infra';
import {INBNFRuleList} from './base';
import {INBNFNormalizedRuleList} from './normalized';
export * from './base';
export * from './normalized';
export * from './compiled';

export interface INBNFTokenizerResult {
    nodes: INBNFASTNodeList,
    end: number,
}
export interface INBNFASTNodeList extends Array<INBNFASTNode> {}
export type INBNFASTNode = INBNFASTRuleNode | number;
export interface INBNFASTRuleNode {
    name: string,
    nodes: INBNFASTNodeList,
}

export interface INBNFTokenizer {
    (
        source: string | Uint32Array,
        ruleName: string,
        from: number,
        positionCallback: PositionCallback,
    ): INBNFASTNode,
}
export interface INBNFCompilerOptions {
    includes?: INBNFRuleList | INBNFNormalizedRuleList,
    expands?: INBNFNormalizedRuleList,
    from?: number,
    positionCallback?: PositionCallback,
}
export interface INBNFTokenizerOptions extends INBNFCompilerOptions {}
