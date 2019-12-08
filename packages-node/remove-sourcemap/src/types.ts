export interface IPatternList extends Array<RegExp | string> {}

export interface IProcessor {
    name: string,
    pattern: IPatternList,
    process: (filePath: string) => void | Promise<void>,
}

export interface IProcessorList extends Array<IProcessor> {}
