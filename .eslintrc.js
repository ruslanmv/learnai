/**
 * ESLint Configuration for LearnAI
 * Production-ready linting rules for Next.js with TypeScript
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license MIT
 */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // Must be last to override other configs
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  rules: {
    // Prettier integration
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],

    // TypeScript specific rules
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],

    // React specific rules
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    "react/prop-types": "off", // Using TypeScript for prop validation
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // General JavaScript/TypeScript rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "quote-props": ["error", "as-needed"],

    // Import rules
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],

    // Best practices
    "no-throw-literal": "error",
    "no-return-await": "error",
    "require-await": "warn",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      // Configuration files
      files: ["*.config.js", "*.config.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "dist/",
    "public/",
    "*.config.js",
    ".eslintrc.js",
  ],
};
