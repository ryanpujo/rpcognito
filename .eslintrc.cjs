module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin", "unused-imports"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.cjs"],
    rules: {
        "unused-imports/no-unused-imports": "error",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    }
}