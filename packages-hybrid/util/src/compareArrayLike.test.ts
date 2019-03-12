import test from 'ava';
import {compareArrayLike} from './compareArrayLike';

const stringify = <TItem>(list: Array<Array<TItem>>): string => {
    return `[${list.map((list) => `[${list.join(', ')}]`).join(', ')}]`;
};

{
    const list = [
        [],
        [1],
        [1, 2, 3],
        [1, 2, 1, 0],
        [1, 2, 1],
        [1, 2],
        [1, 1],
        [0, 1],
        [3],
        [2],
    ];
    const expected = [
        [],
        [0, 1],
        [1],
        [1, 1],
        [1, 2],
        [1, 2, 1],
        [1, 2, 1, 0],
        [1, 2, 3],
        [2],
        [3],
    ];
    test(`${stringify(list)} → ${stringify(expected)}`, (t) => {
        t.deepEqual(list.sort((a, b) => {
            return compareArrayLike<number>(a, b);
        }), expected);
    });
}

{
    const list = [
        [],
        [1],
        [1, 2, 3],
        [1, 2, 1, 0],
        [1, 2, 1],
        [1, 2],
        [1, 1],
        [0, 1],
        [3],
        [2],
    ];
    const expected = [
        [],
        [3],
        [2],
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 1],
        [1, 2, 1, 0],
        [1, 1],
        [0, 1],
    ];
    test(`${stringify(list)} → ${stringify(expected)} (reverse)`, (t) => {
        t.deepEqual(list.sort((a, b) => {
            return compareArrayLike<number>(a, b, (a, b) => {
                if (a < b) {
                    return 1;
                }
                if (b < a) {
                    return -1;
                }
                return 0;
            });
        }), expected);
    });
}
