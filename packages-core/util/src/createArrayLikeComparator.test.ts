import test from 'ava';
import {
    createArrayLikeComparator,
    IComparator,
} from './createArrayLikeComparator';

const stringify = <TItem>(
    list: Array<Array<TItem>>,
): string => `${list.map((list) => `[${list.join(',')}]`).join(',')}`;

interface ITest<TItem> {
    comparator: IComparator<TItem>,
    input: Array<Array<TItem>>,
    expected: Array<Array<TItem>>,
}

([
    {
        comparator: (a, b) => a - b,
        input: [
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
        ],
        expected: [
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
        ],
    },
    {
        comparator: (a, b) => b - a,
        input: [
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
        ],
        expected: [
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
        ],
    },
] as Array<ITest<number>>).forEach(({input, expected, comparator}, index) => {
    const arrayLikeComparator = createArrayLikeComparator(comparator);
    test(`#${index} ${comparator}\n< ${stringify(input)}\n> ${stringify(expected)}`, (t) => {
        t.deepEqual(input.sort(arrayLikeComparator), expected);
    });
});
