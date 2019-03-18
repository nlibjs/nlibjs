export interface IXref {
    type: string,
    data: string,
}
export interface IRecord {
    name: string,
    type: string,
    subtype: string,
    xref: IXref,
}
export interface IParameters extends Map<string, Uint32Array> {}
export interface ISource {
    readonly type: Uint32Array,
    readonly subtype: Uint32Array,
    readonly parameters: IParameters,
}
