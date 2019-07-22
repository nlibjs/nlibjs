declare module '@typescript-eslint/eslint-plugin' {
    import * as eslint from 'eslint';
    export const rules: {
        [name: string]: eslint.Rule.RuleModule,
    };
    export const configs: {};
}
