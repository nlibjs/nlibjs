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
    interface IParameters extends Map<string, string> {}
    interface ISource {
        readonly type: string,
        readonly subtype: string,
        readonly parameters: IParameters,
    }
}
