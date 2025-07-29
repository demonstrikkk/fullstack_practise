<<<<<<< HEAD
// // import { dirname } from "path";
// // import { fileURLToPath } from "url";
// // import { FlatCompat } from "@eslint/eslintrc";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const compat = new FlatCompat({
// //   baseDirectory: __dirname,
// // });

// // const eslintConfig = [...compat.extends("next/core-web-vitals")];

// // export default eslintConfig;




// // import { dirname } from "path";
// // import { fileURLToPath } from "url";
// // import { FlatCompat } from "@eslint/eslintrc";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const compat = new FlatCompat({
// //   baseDirectory: __dirname,
// // });

// // const eslintConfig = [
// //   ...compat.extends("next/core-web-vitals"),
// //   {
// //     settings: {
// //       "import/resolver": {
// //         alias: {
// //           map: [["@", "./"]],
// //           extensions: [".js", ".jsx", ".ts", ".tsx"],
// //         },
// //       },
// //     },
// //   },
// // ];

// // export default eslintConfig;



// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
// import importPlugin from "eslint-plugin-import";
=======
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

<<<<<<< HEAD
// export default [
//   // Extend Next.js rules via FlatCompat
//   ...compat.extends("next/core-web-vitals"),

//   {
//     files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
//     plugins: {
//       import: importPlugin,
//     },
//     languageOptions: {
//       sourceType: "module",
//       ecmaVersion: "latest",
//     },
=======
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
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
//     settings: {
//       "import/resolver": {
//         alias: {
//           map: [["@", "./"]],
//           extensions: [".js", ".jsx", ".ts", ".tsx"],
//         },
//       },
//     },
<<<<<<< HEAD
//     rules: {
//       "import/no-unresolved": "error",
//       "import/named": "error",
//       "import/default": "error",
//       "import/export": "error",
//     },
//   },
// ];






// eslint.mjs
=======
//   },
// ];

// export default eslintConfig;



>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
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
<<<<<<< HEAD
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: ["import"],
=======
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
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
<<<<<<< HEAD
        
      "extends": "next/core-web-vitals",
      "rules": {
        "@next/next/no-img-element": "off",
        "react-hooks/exhaustive-deps": "warn"
      }
    
      
=======
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/export": "error",
    },
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
  },
];
