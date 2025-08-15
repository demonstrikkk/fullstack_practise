// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
// import importPlugin from "eslint-plugin-import";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals"),
//   {
//     rules: {
//       // This turns all warnings into "off"
//       // You can also use plugins to autofill these if needed
//     },
//     // ignorePatterns: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
//   }
// ];

// export default eslintConfig;





import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Example: allow console logs in dev
      // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off"
    },
  },
];

export default eslintConfig;
