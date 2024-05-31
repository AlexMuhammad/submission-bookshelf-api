// @ts-check

const eslint =  require("@eslint/js");
const tseslint = require("typescript-eslint");

tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended
);
