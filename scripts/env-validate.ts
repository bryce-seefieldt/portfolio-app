// scripts/env-validate.ts
// Simple environment validation for public-safe variables required by the app

const REQUIRED = [
  {
    key: "NEXT_PUBLIC_DOCS_BASE_URL",
    get: () => process.env.NEXT_PUBLIC_DOCS_BASE_URL,
  },
  {
    key: "NEXT_PUBLIC_GITHUB_URL",
    get: () => process.env.NEXT_PUBLIC_GITHUB_URL,
  },
  {
    key: "NEXT_PUBLIC_DOCS_GITHUB_URL",
    get: () => process.env.NEXT_PUBLIC_DOCS_GITHUB_URL,
  },
];

function main() {
  const missing = REQUIRED.filter((item) => !item.get() || !String(item.get()).trim());
  if (missing.length > 0) {
    console.error("[env:validate] Missing required environment variables:");
    for (const item of missing) {
      console.error(`  - ${item.key}`);
    }
    console.error("\nAdd these to .env.local for local dev, and set in Vercel for deployments.");
    process.exit(1);
  }

  console.log("[env:validate] All required environment variables are present.");
}

main();
