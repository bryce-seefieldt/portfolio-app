import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  security.configs.recommended,
  {
    rules: {
      // Disable object injection warning for this project since all dynamic keys
      // come from our own StackKey data structures, not user input
      "security/detect-object-injection": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "dist/**",
    "coverage/**",
    ".vercel/**",
    "next-env.d.ts",
    // Test/build artifacts
    "playwright-report/**",
    ".playwright/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
