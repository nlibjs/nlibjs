export const defaultConfigurations = {
    include: [/\.([jt]sx?)$/],
    exclude: [/\.test\./, /node_modules/, /\/test\//, /index\.([jt]sx?)$/],
    filter: (
        relativePath: string,
    ): string => relativePath.replace(/(\.d)?\.([jt]sx?)$/, ''),
};
