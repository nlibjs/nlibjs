import {ReplacementType} from './types';

export const tokenizeReplacementString = function* (
    input: string,
): IterableIterator<string | ReplacementType | number> {
    const regexp = /\$(\$|&|`|'|\d{1,2})/g;
    let position = 0;
    while (1) {
        position = regexp.lastIndex;
        const match = regexp.exec(input);
        if (!match) {
            break;
        }
        const {index} = match;
        if (position < index) {
            yield input.slice(position, index);
        }
        const type = match[1];
        switch (type) {
        case '$':
            yield '$';
            break;
        case '&':
            yield ReplacementType.Matched;
            break;
        case '`':
            yield ReplacementType.Preceding;
            break;
        case '\'':
            yield ReplacementType.Following;
            break;
        default:
            yield Number(type);
        }
    }
    if (position < input.length) {
        yield input.slice(position);
    }
};
