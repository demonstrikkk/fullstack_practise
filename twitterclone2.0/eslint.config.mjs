import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// import importPlugin from "eslint-plugin-import"; // Not used in the current config

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // This extends Next.js recommended configurations
  ...compat.extends("next/core-web-vitals"),
  {
    // You can add specific overrides here if needed
    // The 'files' property isn't necessary unless you have a specific override scope
    rules: {
      // Example: If you wanted to turn off the "no-console" rule for all files:
      // "no-console": "off",
    },
    // REMOVED: The ignorePatterns array that was ignoring all source files
  }
];

export default eslintConfig;
