import {mediatype} from './types';

export class MediaType {

    public readonly type: string

    public readonly subtype: string

    public readonly parameters: mediatype.IParameters

    protected constructor(source: mediatype.ISource) {
        this.type = source.type;
        this.subtype = source.subtype;
        this.parameters = source.parameters;
    }

    public get essence(): string {
        return `${this.type}/${this.subtype}`;
    }

}
