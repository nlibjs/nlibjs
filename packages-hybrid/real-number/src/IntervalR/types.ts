/**
 * [leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag]
 */
export type IntervalR<TNumberLike extends number = number> = [boolean, TNumberLike, TNumberLike, boolean];
