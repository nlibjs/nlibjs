import {mediatype} from './types';

export class MediaType {

    readonly type: string

    readonly subtype: string

    readonly parameters: mediatype.Parameters

    constructor(source: mediatype.Source) {
        this.type = source.type;
        this.subtype = source.subtype;
        this.parameters = source.parameters;
    }

    get essence() {
        return `${this.type}/${this.subtype}`;
    }

}
