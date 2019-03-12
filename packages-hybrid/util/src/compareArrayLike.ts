export const compareArrayLike = <TItem>(
    list1: ArrayLike<TItem>,
    list2: ArrayLike<TItem>,
    comparator: (item1: TItem, item2: TItem) => -1 | 0 | 1 = (item1, item2) => {
        if (item1 < item2) {
            return -1;
        }
        if (item2 < item1) {
            return 1;
        }
        return 0;
    },
): -1 | 0 | 1 => {
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
    if (length1 < length2) {
        return -1;
    }
    if (length2 < length1) {
        return 1;
    }
    return 0;
};
