const path = require('path');
module.exports = {
    overrides: [
        {
            files: 'build/*.ts',
            env: {
                node: true,
            },
            rules: {
                'no-console': 'off',
            },
            parserOptions: {
                project: path.resolve(__dirname, './build/tsconfig.json'),
            },
        },
        {
            files: 'src/*.ts',
            env: {
                node: true,
            },
            rules: {
                'max-lines-per-function': 'off',
                'no-loop-func': 'off',
            },
        },
    ],
};
