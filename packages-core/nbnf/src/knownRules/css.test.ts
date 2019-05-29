import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {runTests, toNodes} from './util';
import {CSSAtomicRules, CSSBaseRules, CSSAnimationRules} from './css';

runTests(createTokenizerFromNormalizedRuleList(CSSAtomicRules), [
    {
        input: '/*ABC*/',
        rule: 'Comment',
        expected: {
            name: 'Comment',
            nodes: toNodes('/*ABC*/'),
        },
    },
    {
        input: '/*ABC*D*/',
        rule: 'Comment',
        expected: {
            name: 'Comment',
            nodes: toNodes('/*ABC*D*/'),
        },
    },
    {
        input: '\r\n\n\r',
        rule: 'NewLine',
        expected: {
            name: 'NewLine',
            nodes: toNodes('\r\n'),
        },
    },
    {
        input: '\r\n\f',
        rule: 'NewLine',
        from: 1,
        expected: {
            name: 'NewLine',
            nodes: toNodes('\n'),
        },
    },
    {
        input: '\r\n\f',
        rule: 'NewLine',
        from: 2,
        expected: {
            name: 'NewLine',
            nodes: toNodes('\f'),
        },
    },
    {
        input: '\t\r\n\f',
        rule: 'WhiteSpace',
        expected: {
            name: 'WhiteSpace',
            nodes: toNodes('\t'),
        },
    },
    {
        input: '\\A',
        rule: 'Escape',
        expected: {
            name: 'Escape',
            nodes: toNodes('\\A'),
        },
    },
    {
        input: '\\\'',
        rule: 'Escape',
        expected: {
            name: 'Escape',
            nodes: toNodes('\\\''),
        },
    },
    {
        input: 'ABC\\\n\\\'',
        rule: 'DoubleQuotedStringToken',
        expected: {
            name: 'DoubleQuotedStringToken',
            nodes: toNodes('ABC\\\n\\\''),
        },
    },
    {
        input: '"ABC\\\'"',
        rule: 'StringToken',
        expected: {
            name: 'StringToken',
            nodes: toNodes('"ABC\\\'"'),
        },
    },
    {
        input: 'ABC',
        rule: 'IdentToken',
        expected: {
            name: 'IdentToken',
            nodes: toNodes('ABC'),
        },
    },
    {
        input: '--ABC',
        rule: 'IdentToken',
        expected: {
            name: 'IdentToken',
            nodes: toNodes('--ABC'),
        },
    },
    {
        input: '5ABC',
        rule: 'IdentToken',
    },
]);

runTests(createTokenizerFromNormalizedRuleList(CSSBaseRules), [
    {
        input: '1s',
        rule: 'Time',
        expected: {name: 'Time', nodes: [
            {name: 'TimeValue', nodes: toNodes('1')},
            {name: 'TimeUnit', nodes: toNodes('s')},
        ]},
    },
    {
        input: '123ms',
        rule: 'Time',
        expected: {name: 'Time', nodes: [
            {name: 'TimeValue', nodes: toNodes('123')},
            {name: 'TimeUnit', nodes: toNodes('ms')},
        ]},
    },
    {
        input: '0123ms',
        rule: 'Time',
    },
]);

runTests(createTokenizerFromNormalizedRuleList(CSSAnimationRules), [
    {
        input: 'linear',
        rule: 'EasingFunction',
        expected: {name: 'EasingFunction', nodes: toNodes('linear')},
    },
    ...['normal', 'reverse', 'alternate', 'alternate-reverse'].map((direction) => ({
        input: direction,
        rule: 'SingleAnimationDirection',
        expected: {
            name: 'SingleAnimationDirection',
            nodes: toNodes(direction),
        },
    })),
    ...['ease', 'ease-in', 'ease-out', 'ease-in-out']
    .map((keyword) => ({
        input: keyword,
        rule: 'EasingFunction',
        expected: {
            name: 'EasingFunction',
            nodes: [{
                name: 'CubicBezierEasingFunction',
                nodes: toNodes(keyword),
            }],
        },
    })),
    ...['step-start', 'step-end']
    .map((keyword) => ({
        input: keyword,
        rule: 'EasingFunction',
        expected: {
            name: 'EasingFunction',
            nodes: [{
                name: 'StepEasingFunction',
                nodes: toNodes(keyword),
            }],
        },
    })),
    {
        input: 'cubic-bezier( .25,0.1,  0.25 ,  1  )',
        rule: 'EasingFunction',
        expected: {
            name: 'EasingFunction',
            nodes: [{
                name: 'CubicBezierEasingFunction',
                nodes: [{
                    name: 'CubicBezierEasingFunctionExpression',
                    nodes: [
                        {
                            name: 'CubicBezierEasingFunctionPrefix',
                            nodes: toNodes('cubic-bezier( '),
                        },
                        {
                            name: 'CubicBezierEasingFunctionCoordinate',
                            nodes: toNodes('.25'),
                        },
                        {
                            name: 'CommaSeparator',
                            nodes: toNodes(','),
                        },
                        {
                            name: 'CubicBezierEasingFunctionCoordinate',
                            nodes: toNodes('0.1'),
                        },
                        {
                            name: 'CommaSeparator',
                            nodes: toNodes(',  '),
                        },
                        {
                            name: 'CubicBezierEasingFunctionCoordinate',
                            nodes: toNodes('0.25'),
                        },
                        {
                            name: 'CommaSeparator',
                            nodes: toNodes(' ,  '),
                        },
                        {
                            name: 'CubicBezierEasingFunctionCoordinate',
                            nodes: toNodes('1'),
                        },
                        {
                            name: 'CubicBezierEasingFunctionSuffix',
                            nodes: toNodes('  )'),
                        },
                    ],
                }],
            }],
        },
    },
    {
        input: 'steps( 123    )',
        rule: 'EasingFunction',
        expected: {
            name: 'EasingFunction',
            nodes: [{
                name: 'StepEasingFunction',
                nodes: [{
                    name: 'StepEasingFunctionExpression',
                    nodes: [
                        {
                            name: 'StepEasingFunctionExpressionPrefix',
                            nodes: toNodes('steps( '),
                        },
                        {
                            name: 'StepEasingFunctionStepCount',
                            nodes: toNodes('123'),
                        },
                        {
                            name: 'StepEasingFunctionExpressionSuffix',
                            nodes: toNodes('    )'),
                        },
                    ],
                }],
            }],
        },
    },
    ...[
        'jump-start',
        'jump-end',
        'jump-none',
        'jump-both',
        'start',
        'end',
    ]
    .map((StepPosition) => ({
        input: `steps( 123    ,${StepPosition})`,
        rule: 'EasingFunction',
        expected: {
            name: 'EasingFunction',
            nodes: [{
                name: 'StepEasingFunction',
                nodes: [{
                    name: 'StepEasingFunctionExpression',
                    nodes: [
                        {
                            name: 'StepEasingFunctionExpressionPrefix',
                            nodes: toNodes('steps( '),
                        },
                        {
                            name: 'StepEasingFunctionStepCount',
                            nodes: toNodes('123'),
                        },
                        {
                            name: 'CommaSeparator',
                            nodes: toNodes('    ,'),
                        },
                        {
                            name: 'StepPosition',
                            nodes: toNodes(StepPosition),
                        },
                        {
                            name: 'StepEasingFunctionExpressionSuffix',
                            nodes: toNodes(')'),
                        },
                    ],
                }],
            }],
        },
    })),
    {
        input: '1s   Foo  ease-out    infinite',
        rule: 'SingleAnimation',
        expected: {name: 'SingleAnimation', nodes: [
            {name: 'SingleAnimationProperty', nodes: [
                {name: 'Time', nodes: [
                    {name: 'TimeValue', nodes: toNodes('1')},
                    {name: 'TimeUnit', nodes: toNodes('s')},
                ]},
            ]},
            ...toNodes('   '),
            {name: 'SingleAnimationProperty', nodes: [
                {name: 'KeyframesName', nodes: [
                    {name: 'CustomIdent', nodes: toNodes('Foo')},
                ]},
            ]},
            ...toNodes('  '),
            {name: 'SingleAnimationProperty', nodes: [
                {name: 'EasingFunction', nodes: [
                    {name: 'CubicBezierEasingFunction', nodes: toNodes('ease-out')},
                ]},
            ]},
            ...toNodes('    '),
            {name: 'SingleAnimationProperty', nodes: [
                {name: 'SingleAnimationIterationCount', nodes: toNodes('infinite')},
            ]},
        ]},
    },
]);
