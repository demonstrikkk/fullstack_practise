// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [...compat.extends("next/core-web-vitals")];

// export default eslintConfig;




// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals"),
//   {
//     settings: {
//       "import/resolver": {
//         alias: {
//           map: [["@", "./"]],
//           extensions: [".js", ".jsx", ".ts", ".tsx"],
//         },
//       },
//     },
//   },
// ];

// export default eslintConfig;



import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extend Next.js rules via FlatCompat
  ...compat.extends("next/core-web-vitals"),

  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/export": "error",
    },
  },
];
