import {ScalarValueString} from '@nlib/infra';

export namespace mediatype {
    interface IXref {
        type: string,
        data: string,
    }
    interface IRecord {
        name: string,
        type: string,
        subtype: string,
        xref: IXref,
    }
    interface IParameters extends Map<string, ScalarValueString> {}
    interface ISource {
        readonly type: ScalarValueString,
        readonly subtype: ScalarValueString,
        readonly parameters: IParameters,
    }
}
