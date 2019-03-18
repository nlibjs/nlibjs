import {patternToRegExp} from './patternToRegExp';
import {Matcher, Pattern} from './types';

export const createMatcher = (pattern: Pattern): Matcher => {
    const regexp = patternToRegExp(pattern);
    return (testee) => regexp.test(testee);
};
