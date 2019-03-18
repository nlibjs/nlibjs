export type Matcher = (testee: string) => boolean;
export type Pattern = string | IRegexpLike;
export interface IRegexpLike {
    test(testee: string): boolean,
}
