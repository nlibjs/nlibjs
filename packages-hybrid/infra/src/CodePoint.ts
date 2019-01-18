import {CodePoint} from './types';
import {ASCIIUpperAlpha, ASCIILowerAlpha} from './4.5.CodePoints';

export const toASCIILowerCase = (codePoint: CodePoint): CodePoint => ASCIIUpperAlpha.has(codePoint) ? codePoint + 0x20 as CodePoint : codePoint;
export const toASCIIUpperCase = (codePoint: CodePoint): CodePoint => ASCIILowerAlpha.has(codePoint) ? codePoint - 0x20 as CodePoint : codePoint;
