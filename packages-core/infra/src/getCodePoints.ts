import {isSurrogate, isLeadingSurrogate, isTrailingSurrogate} from './4.5.CodePoints';

export const getCodePoints = function* (input: string): IterableIterator<number> {
    const {length} = input;
    for (let i = 0; i < length; i++) {
        let codeUnit = input.charCodeAt(i);
        if (isSurrogate(codeUnit)) {
            const nextCodeUnit = input.charCodeAt(i + 1);
            if (isLeadingSurrogate(codeUnit) && isTrailingSurrogate(nextCodeUnit)) {
                codeUnit = (codeUnit - 0xD800) * 0x400 + (nextCodeUnit - 0xDC00) + 0x10000;
                i += 1;
            }
        }
        yield codeUnit;
    }
};
