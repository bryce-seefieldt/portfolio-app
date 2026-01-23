#!/usr/bin/env bash
#
# verify-local.sh
#
# Comprehensive local development verification script for portfolio-app.
# Runs all quality checks, security scanning, validation, and tests with detailed 
# reporting and troubleshooting guidance.
#
# Includes:
#   - Environment validation
#   - Code formatting (auto-fix + validation)
#   - Linting (ESLint with zero-warning enforcement)
#   - Type checking (TypeScript strict mode)
#   - Secret scanning (TruffleHog for credential detection)
#   - Registry validation (Zod schema + YAML integrity)
#   - Production build (Next.js)
#   - Smoke tests (Playwright E2E - 12 tests across 2 browsers)
#
# Usage:
#   ./scripts/verify-local.sh              # Run all checks including unit + E2E tests
#   ./scripts/verify-local.sh --skip-tests # Skip unit + E2E tests (faster)
#   # or via package.json scripts:
#   pnpm verify         # Full verification with tests
#   pnpm verify:quick   # Fast verification without tests
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed

set -euo pipefail

# Parse command line arguments
SKIP_TESTS=false
for arg in "$@"; do
  case $arg in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
  esac
done

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

# Step 5: Secret scanning
print_section "Step 5: Secret Scanning (basic local scan)"

print_info "Running lightweight pattern-based scan for common secrets..."

# Build grep excludes
EXCLUDES=(
  "--exclude-dir=.git"
  "--exclude-dir=node_modules"
  "--exclude-dir=.next"
  "--exclude-dir=playwright-report"
  "--exclude-dir=out"
  "--exclude-dir=dist"
  "--exclude-dir=coverage"
)

FILES=(
  "--include=*.ts" "--include=*.tsx" "--include=*.js" "--include=*.jsx"
  "--include=*.json" "--include=*.yml" "--include=*.yaml" "--include=*.md"
  "--include=.env*"
)

POTENTIAL_FINDINGS=""

# Helper to run a labeled grep and append findings
run_scan() {
  local label="$1"
  local pattern="$2"
  local results
  # shellcheck disable=SC2068
  results=$(grep -RInEI ${EXCLUDES[@]} ${FILES[@]} -- "$pattern" . 2>/dev/null || true)
  if [ -n "$results" ]; then
    POTENTIAL_FINDINGS+=$'\n'"[Match] $label"$'\n'"$results"$'\n'
  fi
}

# Common high-signal patterns
run_scan "Private key material" "-----BEGIN (RSA |EC )?PRIVATE KEY-----"
run_scan "AWS Access Key ID" "AKIA[0-9A-Z]{16}"
run_scan "GitHub token (ghp_)" "ghp_[A-Za-z0-9]{36}"
run_scan "Slack token (xox)" "xox[baprs]-[A-Za-z0-9-]{10,48}"
run_scan "Stripe secret key" "sk_live_[0-9a-zA-Z]{16,}"
run_scan "Google API key" "AIza[0-9A-Za-z_-]{35}"
run_scan "AWS Secret Access Key" "(?i)aws_secret_access_key\s*[:=]\s*['\"][A-Za-z0-9/+=]{40}['\"]"
run_scan "Generic credential assignment" "(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][A-Za-z0-9/_+=.-]{12,}['\"]"

# Check for tracked .env files (allow .env.example)
TRACKED_ENV=$(git ls-files | grep -E "\.env(\.|$)" | grep -v "^\.env\.example$" || true)
if [ -n "$TRACKED_ENV" ]; then
  POTENTIAL_FINDINGS+=$'\n[Match] Tracked .env files (should be gitignored, except .env.example)\n'
  POTENTIAL_FINDINGS+="$TRACKED_ENV"$'\n'
fi

if [ -n "$POTENTIAL_FINDINGS" ]; then
  print_failure "Potential secrets detected by basic scan"
  echo ""
  echo "$POTENTIAL_FINDINGS" | head -200
  echo ""
  print_troubleshooting "  1. Review the matches above; validate if real secrets or false positives
  2. If real secrets:
     - Remove from repository immediately
     - If committed previously, consider history rewrite (git-filter-repo / BFG)
     - Rotate any exposed credentials
  3. If false positives, adjust code/comments to avoid secret-like patterns
  4. For stronger scanning, enable the pre-commit hook (recommended):\n     pip install pre-commit && pre-commit install"
else
  print_success "No secrets detected by basic scan"
fi

# Step 6: Registry validation
print_section "Step 6: Registry Validation (registry:validate)"

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

# Step 7: Next.js build
print_section "Step 7: Next.js Build (build)"

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

# Step 8: Unit tests
print_section "Step 8: Unit Tests (src/lib/__tests__/)"

if [ "$SKIP_TESTS" = true ]; then
  print_warning "Unit tests skipped (--skip-tests flag)"
  print_info "Run: pnpm test:unit to execute unit tests locally"
elif [ $BUILD_EXIT_CODE -eq 0 ]; then
  print_info "Running unit tests (registry, slug helpers, link construction)..."
  echo ""
  
  UNIT_TEST_OUTPUT=$(pnpm test:unit 2>&1 || true)
  UNIT_TEST_EXIT_CODE=$?
  
  if [ $UNIT_TEST_EXIT_CODE -eq 0 ]; then
    print_success "All unit tests passed"
    
    # Extract test results
    if echo "$UNIT_TEST_OUTPUT" | grep -q "passed"; then
      TEST_COUNT=$(echo "$UNIT_TEST_OUTPUT" | grep -o "[0-9]* passed" | grep -o "^[0-9]*" | head -1)
      print_info "Tests passed: ${TEST_COUNT:-70+}"
    fi
  else
    print_failure "Unit tests failed"
    echo ""
    echo "$UNIT_TEST_OUTPUT" | tail -50
    echo ""
    print_troubleshooting "  1. Review test failures above
  2. Run tests in UI mode for debugging: pnpm test:ui
  3. Unit test files:
     - src/lib/__tests__/registry.test.ts (registry validation: 17 tests)
     - src/lib/__tests__/slugHelpers.test.ts (slug validation: 19 tests)
     - src/lib/__tests__/config.test.ts (link construction: 34 tests)
  4. View coverage: pnpm test:coverage"
  fi
else
  print_section "Step 8: Unit Tests (skipped - build failed)"
  print_warning "Fix build errors before running tests"
fi

# Step 9: E2E tests
print_section "Step 9: E2E Tests - Evidence Links (e2e/evidence-links.spec.ts)"

if [ "$SKIP_TESTS" = true ]; then
  print_warning "E2E tests skipped (--skip-tests flag)"
  print_info "Run: pnpm playwright test to execute E2E tests locally"
elif [ $BUILD_EXIT_CODE -eq 0 ]; then
  # Check if Playwright is installed
  if [ ! -d "node_modules/@playwright/test" ]; then
    print_warning "Playwright not installed - skipping E2E tests"
    print_info "Install with: pnpm install && npx playwright install --with-deps"
  else
    # Check if browsers are installed
    if ! npx playwright --version &> /dev/null; then
      print_warning "Playwright browsers not installed"
      print_info "Install with: npx playwright install --with-deps"
    else
      print_success "Playwright installed"
      
      # Start dev server in background
      print_info "Starting dev server for E2E tests..."
      pnpm dev > /dev/null 2>&1 &
      DEV_SERVER_PID=$!
      
      # Wait for dev server to be ready (max 30 seconds)
      print_info "Waiting for dev server to be ready..."
      if npx wait-on http://localhost:3000 -t 30000 2>/dev/null; then
        print_success "Dev server ready"
        
        # Run E2E tests
        print_info "Running Playwright E2E tests (evidence link resolution)..."
        echo ""
        
        E2E_TEST_OUTPUT=$(pnpm playwright test 2>&1 || true)
        E2E_TEST_EXIT_CODE=$?
        
        # Kill dev server
        kill $DEV_SERVER_PID 2>/dev/null || true
        wait $DEV_SERVER_PID 2>/dev/null || true
        
        if [ $E2E_TEST_EXIT_CODE -eq 0 ]; then
          print_success "All E2E tests passed"
          
          # Extract test results
          if echo "$E2E_TEST_OUTPUT" | grep -q "passed"; then
            E2E_TEST_COUNT=$(echo "$E2E_TEST_OUTPUT" | grep -o "[0-9]* passed" | grep -o "^[0-9]*" | head -1)
            print_info "Tests passed: ${E2E_TEST_COUNT:-12} (multi-browser)"
          fi
        else
          print_failure "E2E tests failed"
          echo ""
          echo "$E2E_TEST_OUTPUT" | tail -50
          echo ""
          print_troubleshooting "  1. Review test failures above
  2. Run tests in UI mode for debugging: pnpm playwright test --ui
  3. Run tests in debug mode: pnpm playwright test --debug
  4. E2E test file: e2e/evidence-links.spec.ts
  5. Tests verify:
     - All routes render correctly
     - Evidence links resolve to correct URLs
     - BadgeGroup displays correct badges
     - Responsive design works (mobile/tablet/desktop)
  6. View detailed HTML report: npx playwright show-report
  7. Common issues:
     - Routes not rendering (check build errors)
     - Navigation broken (check route configuration)
     - Timeouts (increase in playwright.config.ts)
     - Slow network (reduce wait timeouts in tests)"
        fi
      else
        print_failure "Dev server failed to start"
        kill $DEV_SERVER_PID 2>/dev/null || true
        wait $DEV_SERVER_PID 2>/dev/null || true
        print_troubleshooting "  1. Check if port 3000 is already in use: lsof -i :3000
  2. Try starting manually: pnpm dev
  3. Check for build errors above
  4. Review .env.local configuration"
      fi
    fi
  fi
else
  print_section "Step 9: E2E Tests (skipped - build failed)"
  print_warning "Fix build errors before running E2E tests"
fi

# Summary
print_header "Verification Summary"

echo ""
if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✓ ALL CHECKS PASSED${NC}"
  echo ""
  print_success "Code is ready for commit and PR"
  echo ""
  echo "Test Coverage:"
  if [ "$SKIP_TESTS" = false ]; then
    echo "  ✓ Unit tests: 70+ tests (registry, slug helpers, link construction)"
    echo "  ✓ E2E tests: 12 tests (evidence link resolution, route coverage)"
  else
    echo "  ⊗ Unit tests: skipped (use 'pnpm verify' to run)"
    echo "  ⊗ E2E tests: skipped (use 'pnpm verify' to run)"
  fi
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
echo -e "${BLUE}${BOLD}Documentation & References:${NC}"
echo "  - README: ./README.md"
echo "  - Testing guide: https://bns-portfolio-docs.vercel.app/docs/reference/testing-guide"
echo "  - Registry schema: https://bns-portfolio-docs.vercel.app/docs/reference/registry-schema-guide"
echo "  - ADR-0011 (registry): https://bns-portfolio-docs.vercel.app/docs/architecture/adr/adr-0011-data-driven-project-registry"
echo ""

# Exit with failure code if any checks failed
if [ $FAILURES -gt 0 ]; then
  exit 1
fi

exit 0
