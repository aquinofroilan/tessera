import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import betterTailwind from "eslint-plugin-better-tailwindcss";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: { "better-tailwindcss": betterTailwind },
        settings: {
            "better-tailwindcss": {
                entryPoint: "app/globals.css",
            },
        },
        rules: {
            "better-tailwindcss/enforce-shorthand-classes": "warn",
            "better-tailwindcss/no-duplicate-classes": "warn",
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
