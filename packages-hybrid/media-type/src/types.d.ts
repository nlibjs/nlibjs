export namespace mediatype {
    interface Xref {
        type: string,
        data: string,
    }
    interface Record {
        name: string,
        type: string,
        subtype: string,
        xref: Xref,
    }
    interface Parameters extends Map<string, string> {}
    interface Source {
        readonly type: string,
        readonly subtype: string,
        readonly parameters: Parameters,
    }
}
