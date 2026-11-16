import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**', 'build/**', 'coverage/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'better-tailwindcss': betterTailwind,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/globals.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'warn',
    },
  },
]);
