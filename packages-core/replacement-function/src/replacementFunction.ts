import {tokenizeReplacementString} from './tokenizeReplacementString';
import {ReplacementType} from './types';

export type ReplacementFunction = (substring: string, ...args: Array<any>) => string;

export const replacementFunction = (
    replacement: string,
): ReplacementFunction => {
    const tokens = [...tokenizeReplacementString(replacement)];
    return (...args) => {
        const sourceString = args.pop() as string;
        const offset = args.pop() as number;
        return tokens.map((token) => {
            if (typeof token === 'string') {
                return token;
            } else if (0 < token) {
                return token < args.length ? args[token] as string : `$${token}`;
            } else if (token === ReplacementType.Matched) {
                return args[0];
            } else if (token === ReplacementType.Preceding) {
                return sourceString.slice(0, offset);
            } else if (token === ReplacementType.Following) {
                return sourceString.slice(offset + args[0].length);
            }
            return '';
        }).join('');
    };
};
