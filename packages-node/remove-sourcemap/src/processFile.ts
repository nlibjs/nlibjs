import {IProcessorList} from './types';

export const processFile = async (
    filePath: string,
    processorList: IProcessorList,
): Promise<string | null> => {
    const matched = processorList.find(({pattern}) => pattern.some((matcher) => {
        if (typeof matcher === 'string') {
            return filePath.endsWith(matcher);
        }
        return matcher.test(filePath);
    }));
    if (matched) {
        await Promise.resolve(matched.process(filePath));
        return matched.name;
    }
    return null;
};
