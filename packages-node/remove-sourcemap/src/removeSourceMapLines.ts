export const removeSourceMapLines = (
    input: string,
): string => {
    const lines = input.split(/\r\n|\r|\n/);
    const lineNumberWidth = `${lines.length + 1}`.length;
    return lines.filter((line, index) => {
        if ((/^\s*\/[/*]\s*#\s+sourceMappingURL\s*=/).test(line)) {
            const lineNumber = `${index + 1}`.padStart(lineNumberWidth);
            console.log(`${lineNumber}: ${line}`);
            return false;
        }
        return true;
    })
    .join('\n');
};
