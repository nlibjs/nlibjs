import {String, Uint32Array} from '@nlib/global';
import {isNumber} from '@nlib/util';
import {CodePointMappingFunction} from '@nlib/infra';
import {INBNFASTNode, INBNFASTNodeList, INBNFTokenizerResult, INBNFASTRuleNode} from './types/misc';

export const defaultPositionCallback = () => {
    // Noop
};
export const nodeToCodePoints = function* (
    node: INBNFASTNode,
    mappingFunction?: CodePointMappingFunction,
): IterableIterator<number> {
    if (isNumber(node)) {
        yield mappingFunction ? mappingFunction(node) : node;
    } else {
        yield* nodeListToScalarValueString(node.nodes, mappingFunction);
    }
};
export const nodeListToCodePoints = function* (
    nodeList: INBNFASTNodeList,
    mappingFunction?: CodePointMappingFunction,
): IterableIterator<number> {
    for (const node of nodeList) {
        yield* nodeToCodePoints(node, mappingFunction);
    }
};

export const nodeToScalarValueString = (
    node: INBNFASTNode,
    mappingFunction?: CodePointMappingFunction,
): Uint32Array => Uint32Array.from(nodeToCodePoints(node, mappingFunction));

export const nodeListToScalarValueString = (
    nodeList: INBNFASTNodeList,
    mappingFunction?: CodePointMappingFunction,
): Uint32Array => Uint32Array.from(nodeListToCodePoints(nodeList, mappingFunction));

export const nodeToString = (
    node: INBNFASTNode,
    mappingFunction?: CodePointMappingFunction,
): string => String.fromCodePoint(...nodeToCodePoints(node, mappingFunction));
export const nodeListToString = (
    nodeList: INBNFASTNodeList,
    mappingFunction?: CodePointMappingFunction,
): string => String.fromCodePoint(...nodeListToCodePoints(nodeList, mappingFunction));

export const nodeToDebugString = (node: INBNFASTNode): string => isNumber(node) ? String.fromCodePoint(node) : `<${node.name}:${nodeListToDebugString(node.nodes)}>`;
export const nodeListToDebugString = (nodeList: INBNFASTNodeList): string => 0 < nodeList.length ? nodeList.map(nodeToDebugString).join('') : '<empty>';
export const tokenizerResultToDebugString = ({nodes, end}: INBNFTokenizerResult): string => `${nodeListToDebugString(nodes)} (${end})`;

export const isASTRuleNode = (node: INBNFASTNode, name?: string): node is INBNFASTRuleNode => !(isNumber(node) || (name && node.name !== name));
