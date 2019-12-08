export const removeSourceMapLines = (
    input: string,
): string => input
.split(/\r\n|\r|\n/)
.filter((line) => !(/^\s*\/[/*]\s*#\s+sourceMappingURL\s*=/).test(line))
.join('\n');
