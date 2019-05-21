import {
    concatenate,
    fromCodePoint,
    fromString,
    everyCodePointIn,
    SOLIDUS,
    SEMICOLON,
    EQUALS_SIGN,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
    toScalarValueString,
    toString,
} from '@nlib/infra';
import {isHTTPToken} from './codePoints';
import {parse} from './parse';
import {IParameters, ISource} from './types';

export class MediaType {

    public readonly type: Uint32Array;

    public readonly subtype: Uint32Array;

    public readonly parameters: IParameters;

    public constructor(source: ISource) {
        this.type = source.type;
        this.subtype = source.subtype;
        this.parameters = source.parameters;
    }

    public static fromString(input: string | Uint32Array): MediaType | null {
        const source = parse(toScalarValueString(input));
        return source ? new MediaType(source) : source;
    }

    public get essence(): Uint32Array {
        return concatenate(this.type, fromCodePoint(SOLIDUS), this.subtype);
    }

    public toString(): string {
        const fragments: Array<Uint32Array> = [this.essence];
        for (const [key, value] of this.parameters) {
            fragments.push(fromCodePoint(SEMICOLON));
            fragments.push(fromString(key));
            fragments.push(fromCodePoint(EQUALS_SIGN));
            if (!everyCodePointIn(value, isHTTPToken) || value.length === 0) {
                fragments.push(fromCodePoint(QUOTATION_MARK));
                for (const codePoint of value) {
                    if (codePoint === QUOTATION_MARK || codePoint === REVERSE_SOLIDUS) {
                        fragments.push(fromCodePoint(REVERSE_SOLIDUS, codePoint));
                    } else {
                        fragments.push(fromCodePoint(codePoint));
                    }
                }
                fragments.push(fromCodePoint(QUOTATION_MARK));
            } else {
                fragments.push(value);
            }
        }
        return toString(concatenate(...fragments));
    }

}
