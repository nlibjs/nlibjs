export type IComparator<TItem> = (item1: TItem, item2: TItem) => number;

export const createArrayLikeComparator = <TItem>(
    comparator: IComparator<TItem>,
): IComparator<ArrayLike<TItem>> => (
    list1: ArrayLike<TItem>,
    list2: ArrayLike<TItem>,
) => {
    const length1 = list1.length;
    const length2 = list2.length;
    const shortLength = length1 < length2 ? length1 : length2;
    for (let index = 0; index < shortLength; index++) {
        const item1 = list1[index];
        const item2 = list2[index];
        const itemComparisonResult = comparator(item1, item2);
        if (itemComparisonResult !== 0) {
            return itemComparisonResult;
        }
    }
    return length1 - length2;
};
