#!/usr/bin/env bash
#
# verify-local.sh
#
# Comprehensive local development verification script for portfolio-app.
# Runs all quality checks, validation, and tests with detailed reporting and troubleshooting guidance.
#
# Usage:
#   ./scripts/verify-local.sh
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Track overall status
FAILURES=0
WARNINGS=0

# Helper functions
print_header() {
  echo ""
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${BLUE}  $1${NC}"
  echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_section() {
  echo ""
  echo -e "${BOLD}${CYAN}▶ $1${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_failure() {
  echo -e "${RED}✗${NC} $1"
  FAILURES=$((FAILURES + 1))
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
  WARNINGS=$((WARNINGS + 1))
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

print_troubleshooting() {
  echo ""
  echo -e "${YELLOW}${BOLD}Troubleshooting:${NC}"
  echo -e "${YELLOW}$1${NC}"
}

# Start
print_header "Portfolio App — Local Development Verification"

echo "Running comprehensive quality checks..."
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Check environment
print_section "Environment Check"

if [ ! -f ".env.local" ]; then
  print_warning ".env.local not found"
  print_troubleshooting "  1. Copy .env.example to .env.local: cp .env.example .env.local
  2. Edit .env.local with your values (required: NEXT_PUBLIC_DOCS_BASE_URL, NEXT_PUBLIC_GITHUB_URL)"
else
  print_success ".env.local exists"
  
  # Check for required env vars
  if grep -q "NEXT_PUBLIC_DOCS_BASE_URL" .env.local && grep -q "NEXT_PUBLIC_GITHUB_URL" .env.local; then
    print_success "Required env vars present"
  else
    print_warning "Some required env vars may be missing"
    print_troubleshooting "  Ensure .env.local contains:
  - NEXT_PUBLIC_DOCS_BASE_URL
  - NEXT_PUBLIC_GITHUB_URL
  - NEXT_PUBLIC_DOCS_GITHUB_URL
  - NEXT_PUBLIC_SITE_URL"
  fi
fi

# Check Node version
NODE_VERSION=$(node --version)
print_info "Node version: $NODE_VERSION"

# Check pnpm
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm --version)
  print_success "pnpm version: $PNPM_VERSION"
else
  print_failure "pnpm not found"
  print_troubleshooting "  Install pnpm: npm install -g pnpm"
  exit 1
fi

# Step 1: Auto-format code
print_section "Step 1: Auto-format (format:write)"

if pnpm format:write > /dev/null 2>&1; then
  print_success "Code formatted successfully"
else
  print_failure "format:write failed"
  print_troubleshooting "  1. Check for syntax errors in JS/TS/JSON files
  2. Run: pnpm format:write --debug-check
  3. Review Prettier config: prettier.config.mjs"
fi

# Step 2: Format check
print_section "Step 2: Format Validation (format:check)"

if pnpm format:check > /dev/null 2>&1; then
  print_success "All files properly formatted"
else
  print_failure "Format check failed"
  print_troubleshooting "  1. Run: pnpm format:write
  2. If still failing, check for files in .prettierignore that shouldn't be
  3. Review formatting errors: pnpm format:check"
fi

# Step 3: Linting
print_section "Step 3: ESLint (lint)"

LINT_OUTPUT=$(pnpm lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
  print_success "ESLint passed (0 warnings)"
else
  print_failure "ESLint failed with warnings or errors"
  echo ""
  echo "$LINT_OUTPUT" | head -50
  echo ""
  print_troubleshooting "  1. Review errors above
  2. Auto-fix some issues: pnpm lint --fix
  3. Check eslint.config.mjs for rule conflicts
  4. Max warnings is set to 0 (strict mode)"
fi

# Step 4: TypeScript type checking
print_section "Step 4: TypeScript (typecheck)"

TYPECHECK_OUTPUT=$(pnpm typecheck 2>&1)
TYPECHECK_EXIT_CODE=$?

if [ $TYPECHECK_EXIT_CODE -eq 0 ]; then
  print_success "TypeScript type checking passed"
else
  print_failure "TypeScript errors detected"
  echo ""
  echo "$TYPECHECK_OUTPUT" | head -50
  echo ""
  print_troubleshooting "  1. Review type errors above
  2. Check tsconfig.json for strict mode settings
  3. Common fixes:
     - Add proper type annotations
     - Use type guards for unions
     - Check for missing imports
  4. Run: pnpm typecheck for full output"
fi

# Step 5: Registry validation
print_section "Step 5: Registry Validation (registry:validate)"

REGISTRY_OUTPUT=$(pnpm registry:validate 2>&1)
REGISTRY_EXIT_CODE=$?

if [ $REGISTRY_EXIT_CODE -eq 0 ]; then
  print_success "Registry validation passed"
  # Extract project count if available
  if echo "$REGISTRY_OUTPUT" | grep -q "Registry OK"; then
    PROJECT_COUNT=$(echo "$REGISTRY_OUTPUT" | grep -o "projects: [0-9]*" | grep -o "[0-9]*")
    print_info "Projects loaded: ${PROJECT_COUNT:-unknown}"
  fi
else
  print_failure "Registry validation failed"
  echo ""
  echo "$REGISTRY_OUTPUT"
  echo ""
  print_troubleshooting "  1. Check src/data/projects.yml for YAML syntax errors
  2. Ensure all required fields are present (slug, title, summary, tags)
  3. Verify URLs are valid absolute URLs or null
  4. Check for duplicate slugs
  5. Review schema: src/lib/registry.ts (ProjectSchema)
  6. Environment variables required for placeholder interpolation:
     - NEXT_PUBLIC_DOCS_BASE_URL
     - NEXT_PUBLIC_GITHUB_URL
     - NEXT_PUBLIC_DOCS_GITHUB_URL"
fi

# Step 6: Next.js build
print_section "Step 6: Next.js Build (build)"

print_info "Starting production build (this may take 30-60 seconds)..."
echo ""

BUILD_OUTPUT=$(pnpm build 2>&1)
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
  print_success "Next.js build completed successfully"
  
  # Extract build stats
  if echo "$BUILD_OUTPUT" | grep -q "Compiled successfully"; then
    print_info "Build compiled successfully"
  fi
  
  # Check for route generation
  if echo "$BUILD_OUTPUT" | grep -q "Route (app)"; then
    ROUTE_COUNT=$(echo "$BUILD_OUTPUT" | grep -E "^(├|└)" | wc -l)
    print_info "Routes generated: $ROUTE_COUNT"
  fi
else
  print_failure "Next.js build failed"
  echo ""
  echo "$BUILD_OUTPUT" | tail -100
  echo ""
  print_troubleshooting "  1. Review build errors above
  2. Common issues:
     - Missing environment variables (.env.local)
     - Type errors (run pnpm typecheck first)
     - Import errors (check for circular dependencies)
     - Registry validation issues (run pnpm registry:validate)
  3. Clean build cache: rm -rf .next
  4. Reinstall dependencies: rm -rf node_modules && pnpm install
  5. Check build output for specific error messages"
fi

# Step 7: Smoke tests (optional - only if build passed)
if [ $BUILD_EXIT_CODE -eq 0 ]; then
  print_section "Step 7: Smoke Tests (optional)"
  
  print_info "Smoke tests require Playwright browsers installed"
  print_info "To run smoke tests manually:"
  echo "  1. Start dev server: pnpm dev"
  echo "  2. In another terminal: pnpm test"
  echo "  3. Or use UI mode: pnpm test:ui"
  
  # Check if Playwright is set up
  if [ -d "node_modules/@playwright/test" ]; then
    print_success "Playwright installed"
  else
    print_warning "Playwright not installed"
    print_info "Install with: pnpm install && npx playwright install --with-deps"
  fi
else
  print_section "Step 7: Smoke Tests (skipped - build failed)"
  print_warning "Fix build errors before running tests"
fi

# Summary
print_header "Verification Summary"

echo ""
if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✓ ALL CHECKS PASSED${NC}"
  echo ""
  print_success "Code is ready for commit and PR"
  echo ""
  echo "Next steps:"
  echo "  1. Review changes: git status"
  echo "  2. Stage changes: git add <files>"
  echo "  3. Commit: git commit -m \"<message>\""
  echo "  4. Push: git push"
  echo "  5. Create PR with closing keyword (e.g., 'Closes #123')"
else
  echo -e "${RED}${BOLD}✗ $FAILURES CHECK(S) FAILED${NC}"
  echo ""
  print_failure "Fix errors before committing"
  echo ""
  echo "Quick fixes to try:"
  echo "  1. Auto-format: pnpm format:write"
  echo "  2. Auto-lint: pnpm lint --fix"
  echo "  3. Check .env.local has required vars"
  echo "  4. Validate registry: pnpm registry:validate"
  echo "  5. Clean and rebuild: rm -rf .next && pnpm build"
fi

if [ $WARNINGS -gt 0 ]; then
  echo ""
  echo -e "${YELLOW}⚠ $WARNINGS WARNING(S)${NC}"
  echo "Review warnings above - they may not block commit but should be addressed"
fi

echo ""
echo -e "${BLUE}${BOLD}Documentation:${NC}"
echo "  - README: ./README.md"
echo "  - Registry schema: https://bns-portfolio-docs.vercel.app/docs/reference/registry-schema-guide"
echo "  - ADR-0011 (registry): https://bns-portfolio-docs.vercel.app/docs/architecture/adr/adr-0011-data-driven-project-registry"
echo ""

# Exit with failure code if any checks failed
if [ $FAILURES -gt 0 ]; then
  exit 1
fi

exit 0
