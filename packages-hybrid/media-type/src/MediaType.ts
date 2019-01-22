import {mediatype} from './types';
import {
    ScalarValueString,
    concatenate,
    fromCodePoint,
    fromString,
    everyCodePointIn,
    SOLIDUS,
    SEMICOLON,
    EQUALS_SIGN,
    QUOTATION_MARK,
    REVERSE_SOLIDUS,
} from '@nlib/infra';
import {isHTTPToken} from './codePoints';

export class MediaType {

    public readonly type: ScalarValueString

    public readonly subtype: ScalarValueString

    public readonly parameters: mediatype.IParameters

    public constructor(source: mediatype.ISource) {
        this.type = source.type;
        this.subtype = source.subtype;
        this.parameters = source.parameters;
    }

    public get essence(): ScalarValueString {
        return concatenate(this.type, fromCodePoint(SOLIDUS), this.subtype);
    }

    public toString(): string {
        const fragments: Array<ScalarValueString> = [this.essence];
        for (const [key, value] of this.parameters) {
            fragments.push(fromCodePoint(SEMICOLON));
            fragments.push(fromString(key));
            fragments.push(fromCodePoint(EQUALS_SIGN));
            if (!everyCodePointIn(value, isHTTPToken) || value.isEmpty) {
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
        return `${concatenate(...fragments)}`;
    }

}
