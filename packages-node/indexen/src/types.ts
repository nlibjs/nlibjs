export interface IConfiguration {
    directory: string,
    dest?: string,
    include: Array<RegExp>,
    exclude: Array<RegExp>,
    filter: (relativePath: string) => string,
}

export interface IOptions {
    directory: string,
    dest?: string,
    include?: Array<RegExp>,
    exclude?: Array<RegExp>,
    filter?: (relativePath: string) => string,
}
