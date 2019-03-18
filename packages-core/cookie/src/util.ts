export const domainToLabels = (domain: string): Array<string> => domain.split('.').reverse();
export const pathToEdges = (path: string): Array<string> => path.slice(1).split('/');
