// scripts/env-validate.ts
// Simple environment validation for public-safe variables required by the app

const REQUIRED = [
  "NEXT_PUBLIC_DOCS_BASE_URL",
  "NEXT_PUBLIC_GITHUB_URL",
  "NEXT_PUBLIC_DOCS_GITHUB_URL",
];

function main() {
  const missing = REQUIRED.filter((key) => !process.env[key] || !String(process.env[key]).trim());
  if (missing.length > 0) {
    console.error("[env:validate] Missing required environment variables:");
    for (const key of missing) {
      console.error(`  - ${key}`);
    }
    console.error("\nAdd these to .env.local for local dev, and set in Vercel for deployments.");
    process.exit(1);
  }

  console.log("[env:validate] All required environment variables are present.");
}

main();
