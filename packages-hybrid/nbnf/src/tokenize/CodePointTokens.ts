import {hasSetZ, IntervalZ} from '@nlib/real-number';
import {
    INBNFCompiledCodePointElement, INBNFTokenizerResult,
} from '../types';

export const collectCodePointTokens = function* (
    [min, max]: IntervalZ,
    {data}: INBNFCompiledCodePointElement,
    input: Uint32Array,
    from: number,
): IterableIterator<INBNFTokenizerResult> {
    let position = from;
    const codePoints: Array<number> = [];
    while (codePoints.length < max) {
        const codePoint = input[position];
        if (hasSetZ(data, codePoint)) {
            codePoints.push(codePoint);
            position++;
        } else {
            break;
        }
    }
    for (let {length} = codePoints; min <= length; length--) {
        yield {
            nodes: codePoints.slice(0, length),
            end: from + length,
        };
    }
};
