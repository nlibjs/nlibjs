import {NlibError} from '@nlib/util';
import {
    PositionCallback,
    getNextLineHead,
    isASCIINewline,
    toScalarValueString,
    skip,
} from '@nlib/infra';
import {
    INBNFRuleList,
} from '../types';
import {parseRule} from './Rule';
import {skipCNL} from '../skip';
import {isWSP} from '../codePoints';

export const parseRuleList = (
    source: Uint32Array | string,
    from: number,
    positionCallback: PositionCallback,
): INBNFRuleList => {
    const input = toScalarValueString(source);
    let position = from;
    const rules: INBNFRuleList = {};
    const {length: inputLength} = input;
    while (position < inputLength) {
        const newPosition = skipCNL(input, skip(input, position, isWSP));
        if (position < newPosition) {
            position = newPosition;
        } else if (isASCIINewline(input[position])) {
            position = getNextLineHead(input, position);
        } else {
            const {name, incremental, elements} = parseRule(
                input,
                position,
                (newPosition) => {
                    position = newPosition;
                },
            );
            if (incremental) {
                const alreadyDefinedRule = rules[name];
                if (alreadyDefinedRule) {
                    alreadyDefinedRule.push(...elements);
                } else {
                    throw new NlibError({
                        code: 'nbnf/parseRuleList/1',
                        message: `${name} is incremental rule but it's not defined at ${position}`,
                        data: {input, from},
                    });
                }
            } else if (rules[name]) {
                throw new NlibError({
                    code: 'nbnf/parseRuleList/2',
                    message: `${name} is non-incremental rule but it is already defined`,
                    data: {input, from},
                });
            } else {
                rules[name] = elements;
            }
        }
    }
    positionCallback(position);
    return rules;
};
