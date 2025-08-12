import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,

});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // This turns all warnings into "off"
      // You can also use plugins to autofill these if needed
    },
    ignorePatterns: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
  }
];

export default eslintConfig;
