import {Math} from '@nlib/global';

export interface IPrefixMap {
    readonly [exponent: number]: string | undefined,
}

export interface IHumanReadableProps {
    base: number,
    round: (input: number) => number,
    digits: number,
    prefix: IPrefixMap,
    delimiter: string,
}

export const DefaultHumanReadablePrefixes: IPrefixMap = {
    [-5]: 'f',
    [-4]: 'p',
    [-3]: 'n',
    [-2]: 'μ',
    [-1]: 'm',
    0: '',
    1: 'K',
    2: 'M',
    3: 'G',
    4: 'T',
    5: 'P',
    6: 'E',
    7: 'Z',
    8: 'Y',
};

export const DefaultHumanReadableProps: IHumanReadableProps = {
    base: 1000,
    round: Math.round,
    digits: 1,
    prefix: DefaultHumanReadablePrefixes,
    delimiter: '',
};

export const fillHumanReadableProps = (
    options?: Partial<IHumanReadableProps>,
): IHumanReadableProps => ({
    ...DefaultHumanReadableProps,
    ...options,
});

export const humanReadable = (
    value: number,
    options?: Partial<IHumanReadableProps>,
): string => {
    const props = fillHumanReadableProps(options);
    const {base} = props;
    let {digits} = props;
    const logarithm = Math.log(value) / Math.log(base);
    let exponent = Math.floor(logarithm);
    let significand = Math.pow(base, logarithm - exponent);
    if (0 <= digits) {
        const offset = Math.pow(10, digits);
        significand = props.round(significand * offset) / offset;
        while (base <= significand) {
            exponent += 1;
            significand /= base;
        }
    }
    const prefix = props.prefix[exponent];
    if (prefix) {
        if (exponent < 0) {
            digits = 0;
        }
        return `${significand.toFixed(digits < 0 ? 0 : digits)}${props.delimiter}${prefix}`;
    }
    return `${value}`;
};
