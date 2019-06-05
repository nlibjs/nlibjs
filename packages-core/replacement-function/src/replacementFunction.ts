import {tokenizeReplacementString} from './tokenizeReplacementString';
import {ReplacementType} from './types';

export type ReplacementFunction = (substring: string, ...args: Array<any>) => string;

export const replacementFunction = (
    replacement: ReplacementFunction | string,
): ReplacementFunction => {
    if (typeof replacement === 'function') {
        return replacement;
    }
    const tokens = [...tokenizeReplacementString(replacement)];
    return (...args) => {
        const sourceString: string = args.pop();
        const offset: number = args.pop();
        return tokens.map((token) => {
            if (typeof token === 'string') {
                return token;
            } else if (0 < token) {
                return token < args.length ? args[token] : `$${token}`;
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
