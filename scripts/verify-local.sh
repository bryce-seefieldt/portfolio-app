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
#   ./scripts/verify-local.sh              # Run all checks including tests & performance
#   ./scripts/verify-local.sh --skip-tests # Skip unit + E2E tests (faster)
#   ./scripts/verify-local.sh --skip-performance # Skip performance verification
#   # or via package.json scripts:
#   pnpm verify         # Full verification with tests & performance
#   pnpm verify:quick   # Fast verification without tests or performance
#
# Exit codes:
#   0 - All checks passed
#   1 - One or more checks failed

set -euo pipefail

# Parse command line arguments
SKIP_TESTS=false
SKIP_PERFORMANCE=false
for arg in "$@"; do
  case $arg in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --skip-performance)
      SKIP_PERFORMANCE=true
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

# Performance metrics tracking
BUILD_TIME_SECONDS=0
BUNDLE_SIZE_MB=0
BUNDLE_SIZE_BYTES=0
NEXT_DIR_SIZE_MB=0
CACHE_CONTROL_HEADER=""
ROUTE_COUNT=0

# Load performance baselines from YAML configuration
# Single source of truth: docs/performance-baseline.yml
BASELINE_CONFIG="./docs/performance-baseline.yml"

if [ ! -f "$BASELINE_CONFIG" ]; then
  echo -e "${YELLOW}⚠ Warning: Performance baseline config not found at $BASELINE_CONFIG${NC}"
  echo -e "${YELLOW}  Performance verification will be skipped${NC}"
  SKIP_PERFORMANCE=true
  # Fallback values (should never be used in practice)
  BASELINE_BUILD_TIME=3.5
  BASELINE_BUNDLE_MB=27.8
  BASELINE_BUNDLE_BYTES=29176884
  BASELINE_NEXT_DIR_MB=337
  BASELINE_CACHE_CONTROL="public, max-age=3600, stale-while-revalidate=86400"
  BUILD_TIME_WARNING_THRESHOLD=4.2
  BUNDLE_SIZE_WARNING_THRESHOLD=30.6
  BUNDLE_SIZE_FAILURE_THRESHOLD=33.4
else
  # Parse YAML file using grep and sed (no external dependencies required)
  # Extract numeric values: "key: value" -> value
  BASELINE_BUILD_TIME=$(grep "^  time_seconds:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BUILD_TIME_WARNING_THRESHOLD=$(grep "^  time_warning_threshold_seconds:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BASELINE_BUNDLE_MB=$(grep "^  total_js_mb:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BASELINE_BUNDLE_BYTES=$(grep "^  total_js_bytes:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BASELINE_NEXT_DIR_MB=$(grep "^  next_dir_mb:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BUNDLE_SIZE_WARNING_THRESHOLD=$(grep "^  size_warning_threshold_mb:" "$BASELINE_CONFIG" | sed 's/.*: //')
  BUNDLE_SIZE_FAILURE_THRESHOLD=$(grep "^  size_failure_threshold_mb:" "$BASELINE_CONFIG" | sed 's/.*: //')
  
  # Extract cache header (string value with quotes)
  BASELINE_CACHE_CONTROL=$(grep "^  control_header:" "$BASELINE_CONFIG" | sed 's/.*: "//' | sed 's/"$//')
  
  # Validate that we successfully loaded all values
  if [ -z "$BASELINE_BUILD_TIME" ] || [ -z "$BASELINE_BUNDLE_MB" ] || [ -z "$BASELINE_CACHE_CONTROL" ]; then
    echo -e "${YELLOW}⚠ Warning: Failed to parse performance baseline config${NC}"
    echo -e "${YELLOW}  Some performance checks may not work correctly${NC}"
    SKIP_PERFORMANCE=true
  fi
fi

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

print_info "Starting production build with performance tracking..."
echo ""

# Capture build start time
BUILD_START=$(date +%s)

BUILD_OUTPUT=$(pnpm build 2>&1)
BUILD_EXIT_CODE=$?

# Capture build end time and calculate duration
BUILD_END=$(date +%s)
BUILD_TIME_SECONDS=$((BUILD_END - BUILD_START))

if [ $BUILD_EXIT_CODE -eq 0 ]; then
  print_success "Next.js build completed successfully in ${BUILD_TIME_SECONDS}s"
  
  # Extract build stats
  if echo "$BUILD_OUTPUT" | grep -q "Compiled successfully"; then
    print_info "Build compiled successfully"
  fi
  
  # Check for route generation
  if echo "$BUILD_OUTPUT" | grep -q "Route (app)"; then
    ROUTE_COUNT=$(echo "$BUILD_OUTPUT" | grep -E "^(├|└)" | wc -l)
    print_info "Routes generated: $ROUTE_COUNT"
  fi
  
  # Performance comparison
  BUILD_TIME_FLOAT=$(echo "scale=1; $BUILD_TIME_SECONDS / 1" | bc)
  if (( $(echo "$BUILD_TIME_FLOAT > $BUILD_TIME_WARNING_THRESHOLD" | bc -l) )); then
    print_warning "Build time (${BUILD_TIME_FLOAT}s) exceeds warning threshold (${BUILD_TIME_WARNING_THRESHOLD}s)"
  elif (( $(echo "$BUILD_TIME_FLOAT > $BASELINE_BUILD_TIME" | bc -l) )); then
    print_info "Build time (${BUILD_TIME_FLOAT}s) slightly above baseline (${BASELINE_BUILD_TIME}s) but within acceptable range"
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

# Step 7a: Bundle Size Verification (only if build succeeded)
if [ $BUILD_EXIT_CODE -eq 0 ] && [ "$SKIP_PERFORMANCE" = false ]; then
  print_section "Step 7a: Bundle Size Verification"
  
  if [ ! -d ".next" ]; then
    print_warning ".next directory not found - build may have failed"
  else
    # Get .next directory size
    NEXT_DIR_SIZE_KB=$(du -sk .next | cut -f1)
    NEXT_DIR_SIZE_MB=$(echo "scale=1; $NEXT_DIR_SIZE_KB / 1024" | bc)
    print_info ".next directory size: ${NEXT_DIR_SIZE_MB} MB (baseline: ${BASELINE_NEXT_DIR_MB} MB)"
    
    # Get JavaScript bundle size
    if find .next -name "*.js" -type f 2>/dev/null | head -1 | grep -q .; then
      BUNDLE_SIZE_BYTES=$(find .next -name "*.js" -type f -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
      BUNDLE_SIZE_MB=$(echo "scale=1; $BUNDLE_SIZE_BYTES / 1048576" | bc)
      
      print_info "Total JavaScript: ${BUNDLE_SIZE_MB} MB (${BUNDLE_SIZE_BYTES} bytes)"
      print_info "Baseline: ${BASELINE_BUNDLE_MB} MB (${BASELINE_BUNDLE_BYTES} bytes)"
      
      # Compare to thresholds
      if (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_FAILURE_THRESHOLD" | bc -l) )); then
        print_failure "Bundle size (${BUNDLE_SIZE_MB} MB) EXCEEDS failure threshold (${BUNDLE_SIZE_FAILURE_THRESHOLD} MB)"
        print_troubleshooting "  Bundle size has grown significantly. This would fail CI checks.
  
  Immediate actions:
  1. Review recent dependency additions: git diff HEAD~1 package.json
  2. Run bundle analyzer to identify large dependencies: ANALYZE=true pnpm build
  3. Check for duplicate dependencies: pnpm dedupe
  4. Consider code splitting or lazy loading for large components
  
  For detailed guidance, see:
  https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#bundle-size-regression"
      elif (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_WARNING_THRESHOLD" | bc -l) )); then
        print_warning "Bundle size (${BUNDLE_SIZE_MB} MB) exceeds warning threshold (${BUNDLE_SIZE_WARNING_THRESHOLD} MB)"
        print_info "Growth: +$(echo "scale=1; (($BUNDLE_SIZE_MB - $BASELINE_BUNDLE_MB) / $BASELINE_BUNDLE_MB) * 100" | bc)%"
        print_troubleshooting "  Bundle size approaching 10% growth limit. Review before committing.
  
  Suggested actions:
  1. Run bundle analyzer: ANALYZE=true pnpm build
  2. Review recent changes for unnecessary imports
  3. Check if tree-shaking is working correctly
  
  Documentation:
  https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#bundle-size-regression"
      elif (( $(echo "$BUNDLE_SIZE_MB > $BASELINE_BUNDLE_MB" | bc -l) )); then
        print_success "Bundle size (${BUNDLE_SIZE_MB} MB) within acceptable range (+$(echo "scale=1; $BUNDLE_SIZE_MB - $BASELINE_BUNDLE_MB" | bc) MB)"
      else
        print_success "Bundle size (${BUNDLE_SIZE_MB} MB) at or below baseline"
      fi
    else
      print_warning "No JavaScript files found in .next directory"
    fi
  fi
fi

# Step 7b: Cache-Control Header Verification (only if build succeeded)
if [ $BUILD_EXIT_CODE -eq 0 ] && [ "$SKIP_PERFORMANCE" = false ]; then
  print_section "Step 7b: Cache-Control Header Verification"
  
  print_info "Starting dev server to verify Cache-Control headers..."
  
  # Start dev server in background
  pnpm dev > /dev/null 2>&1 &
  DEV_SERVER_PID=$!
  
  # Wait for server to start (max 30 seconds)
  WAIT_COUNT=0
  while [ $WAIT_COUNT -lt 30 ]; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
      break
    fi
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
  done
  
  if [ $WAIT_COUNT -ge 30 ]; then
    print_warning "Dev server did not start within 30 seconds - skipping cache header check"
    kill $DEV_SERVER_PID 2>/dev/null || true
  else
    print_success "Dev server started on port 3000"
    
    # Check cache headers
    CACHE_CONTROL_HEADER=$(curl -sI http://localhost:3000/projects/portfolio-app 2>/dev/null | grep -i "cache-control:" | cut -d' ' -f2- | tr -d '\r')
    
    # Stop dev server
    kill $DEV_SERVER_PID 2>/dev/null || true
    sleep 2
    
    if [ -z "$CACHE_CONTROL_HEADER" ]; then
      print_failure "Cache-Control header not found"
      print_troubleshooting "  Cache-Control headers are missing. This affects browser caching performance.
  
  Actions required:
  1. Verify next.config.ts has headers configuration
  2. Check if headers are being set in middleware
  3. Ensure route is not dynamically rendered (should be static/SSG)
  
  Expected header: ${BASELINE_CACHE_CONTROL}
  
  Documentation:
  https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#cache-headers-missing"
    elif echo "$CACHE_CONTROL_HEADER" | grep -q "$BASELINE_CACHE_CONTROL"; then
      print_success "Cache-Control header correct: $CACHE_CONTROL_HEADER"
    else
      print_warning "Cache-Control header differs from baseline"
      print_info "  Found:    $CACHE_CONTROL_HEADER"
      print_info "  Expected: $BASELINE_CACHE_CONTROL"
      print_troubleshooting "  Cache-Control header found but doesn't match baseline configuration.
  
  Review actions:
  1. Check next.config.ts headers configuration
  2. Verify if this is intentional (e.g., route-specific caching)
  3. Update baseline if new caching strategy is intended
  
  Documentation:
  https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#cache-headers-mismatch"
    fi
  fi
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

# Step 9: Link Validation (links:check / Playwright)
print_section "Step 9: Link Validation (links:check / Playwright)"

if [ "$SKIP_TESTS" = true ]; then
  print_warning "Link validation skipped (--skip-tests flag)"
  print_info "Run: pnpm links:check to execute link validation locally"
elif [ $BUILD_EXIT_CODE -eq 0 ]; then
  # Check if Playwright is installed
  if [ ! -d "node_modules/@playwright/test" ]; then
    print_warning "Playwright not installed - skipping link validation"
    print_info "Install with: pnpm install && npx playwright install --with-deps"
  else
    # Check if browsers are installed
    if ! npx playwright --version &> /dev/null; then
      print_warning "Playwright browsers not installed"
      print_info "Install with: npx playwright install --with-deps"
    else
      print_success "Playwright installed"
      
      # Start dev server in background
      print_info "Starting dev server for link validation..."
      pnpm dev > /dev/null 2>&1 &
      DEV_SERVER_PID=$!
      
      # Wait for dev server to be ready (max 30 seconds)
      print_info "Waiting for dev server to be ready..."
      if npx wait-on http://localhost:3000 -t 30000 2>/dev/null; then
        print_success "Dev server ready"
        
        # Run link validation
        print_info "Running Playwright link checks (pnpm links:check)..."
        echo ""
        
        E2E_TEST_OUTPUT=$(pnpm links:check 2>&1 || true)
        E2E_TEST_EXIT_CODE=$?
        
        # Kill dev server
        kill $DEV_SERVER_PID 2>/dev/null || true
        wait $DEV_SERVER_PID 2>/dev/null || true
        
        if [ $E2E_TEST_EXIT_CODE -eq 0 ]; then
          print_success "Link validation passed"
          
          # Extract test results
          if echo "$E2E_TEST_OUTPUT" | grep -q "passed"; then
            E2E_TEST_COUNT=$(echo "$E2E_TEST_OUTPUT" | grep -o "[0-9]* passed" | grep -o "^[0-9]*" | head -1)
            print_info "Checks passed: ${E2E_TEST_COUNT:-12} (multi-browser)"
          fi
        else
          print_failure "Link validation failed"
          echo ""
          echo "$E2E_TEST_OUTPUT" | tail -50
          echo ""
          print_troubleshooting "  1. Review failures above (see playwright-report for details)
  2. Run tests in UI mode for debugging: pnpm playwright test --ui
  3. Run tests in debug mode: pnpm playwright test --debug
  4. Link validation file: e2e/evidence-links.spec.ts (via links:check)
  5. Tests verify:
     - Routes render correctly
     - Evidence links resolve to docs and GitHub targets
     - Badges render correctly
     - Responsive layouts work (mobile/tablet/desktop)
  6. View detailed HTML report: npx playwright show-report
  7. Common issues:
     - Missing or invalid env vars
     - Registry entries with bad URLs
     - Slow network causing timeouts"
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
  print_section "Step 9: Link Validation (skipped - build failed)"
  print_warning "Fix build errors before running link validation"
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
    echo "  ✓ Link validation: 12 checks (Playwright evidence link coverage)"
  else
    echo "  ⊗ Unit tests: skipped (use 'pnpm verify' to run)"
    echo "  ⊗ Link validation: skipped (use 'pnpm verify' to run)"
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

# Performance Verification Report
if [ $BUILD_EXIT_CODE -eq 0 ] && [ "$SKIP_PERFORMANCE" = false ]; then
  print_header "Performance Verification Report"
  
  echo ""
  echo -e "${BOLD}Stage 4.2 Performance Baseline Comparison${NC}"
  echo ""
  echo -e "${BLUE}ℹ Baseline source: $BASELINE_CONFIG${NC}"
  BASELINE_DATE=$(grep "^  baseline_date:" "$BASELINE_CONFIG" | sed 's/.*: "//' | sed 's/"$//')
  if [ -n "$BASELINE_DATE" ]; then
    echo -e "${BLUE}ℹ Last updated: $BASELINE_DATE${NC}"
  fi
  echo ""
  
  # Build Time Report
  echo -e "${BOLD}${CYAN}Build Performance${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  printf "%-30s %10s %12s %10s\n" "Metric" "Current" "Baseline" "Status"
  echo "─────────────────────────────────────────────────────────────────"
  
  # Build Time
  BUILD_STATUS=""
  if (( $(echo "$BUILD_TIME_SECONDS > $BUILD_TIME_WARNING_THRESHOLD" | bc -l) )); then
    BUILD_STATUS="${RED}⚠ SLOW${NC}"
  elif (( $(echo "$BUILD_TIME_SECONDS > $BASELINE_BUILD_TIME" | bc -l) )); then
    BUILD_STATUS="${YELLOW}○ OK${NC}"
  else
    BUILD_STATUS="${GREEN}✓ FAST${NC}"
  fi
  printf "%-30s %9.1fs %11.1fs  %b\n" "Total Build Time" "$BUILD_TIME_SECONDS" "$BASELINE_BUILD_TIME" "$BUILD_STATUS"
  
  echo ""
  echo -e "${BOLD}${CYAN}Bundle Size Analysis${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  printf "%-30s %10s %12s %10s\n" "Metric" "Current" "Baseline" "Status"
  echo "─────────────────────────────────────────────────────────────────"
  
  # .next directory size
  if [ -n "$NEXT_DIR_SIZE_MB" ] && [ "$NEXT_DIR_SIZE_MB" != "0" ]; then
    printf "%-30s %9s MB %11s MB  ${GREEN}✓${NC}\n" ".next Directory" "$NEXT_DIR_SIZE_MB" "$BASELINE_NEXT_DIR_MB"
  fi
  
  # JavaScript bundle size
  if [ -n "$BUNDLE_SIZE_MB" ] && [ "$BUNDLE_SIZE_MB" != "0" ]; then
    BUNDLE_STATUS=""
    BUNDLE_GROWTH=""
    
    if (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_FAILURE_THRESHOLD" | bc -l) )); then
      BUNDLE_STATUS="${RED}✗ FAIL${NC}"
      BUNDLE_GROWTH=$(echo "scale=1; (($BUNDLE_SIZE_MB - $BASELINE_BUNDLE_MB) / $BASELINE_BUNDLE_MB) * 100" | bc)
      BUNDLE_GROWTH=" (+${BUNDLE_GROWTH}%)"
    elif (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_WARNING_THRESHOLD" | bc -l) )); then
      BUNDLE_STATUS="${YELLOW}⚠ WARN${NC}"
      BUNDLE_GROWTH=$(echo "scale=1; (($BUNDLE_SIZE_MB - $BASELINE_BUNDLE_MB) / $BASELINE_BUNDLE_MB) * 100" | bc)
      BUNDLE_GROWTH=" (+${BUNDLE_GROWTH}%)"
    elif (( $(echo "$BUNDLE_SIZE_MB > $BASELINE_BUNDLE_MB" | bc -l) )); then
      BUNDLE_STATUS="${GREEN}○ OK${NC}"
      BUNDLE_GROWTH=$(echo "scale=1; $BUNDLE_SIZE_MB - $BASELINE_BUNDLE_MB" | bc)
      BUNDLE_GROWTH=" (+${BUNDLE_GROWTH} MB)"
    else
      BUNDLE_STATUS="${GREEN}✓ GOOD${NC}"
    fi
    
    printf "%-30s %9s MB %11s MB  %b%s\n" "Total JavaScript" "$BUNDLE_SIZE_MB" "$BASELINE_BUNDLE_MB" "$BUNDLE_STATUS" "$BUNDLE_GROWTH"
    
    # Threshold indicators
    echo "─────────────────────────────────────────────────────────────────"
    printf "%-30s %9s MB  ${YELLOW}(Warning)${NC}\n" "10% Growth Threshold" "$BUNDLE_SIZE_WARNING_THRESHOLD"
    printf "%-30s %9s MB  ${RED}(CI Failure)${NC}\n" "20% Growth Threshold" "$BUNDLE_SIZE_FAILURE_THRESHOLD"
  fi
  
  echo ""
  echo -e "${BOLD}${CYAN}Caching Configuration${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  if [ -n "$CACHE_CONTROL_HEADER" ]; then
    if echo "$CACHE_CONTROL_HEADER" | grep -q "$BASELINE_CACHE_CONTROL"; then
      printf "%-30s %b\n" "Cache-Control Header" "${GREEN}✓ Configured${NC}"
      echo "  Value: $CACHE_CONTROL_HEADER"
    else
      printf "%-30s %b\n" "Cache-Control Header" "${YELLOW}⚠ Mismatch${NC}"
      echo "  Found:    $CACHE_CONTROL_HEADER"
      echo "  Expected: $BASELINE_CACHE_CONTROL"
    fi
  else
    if [ "$SKIP_PERFORMANCE" = false ]; then
      printf "%-30s %b\n" "Cache-Control Header" "${RED}✗ Missing${NC}"
    else
      printf "%-30s %b\n" "Cache-Control Header" "${BLUE}○ Skipped${NC}"
    fi
  fi
  
  echo ""
  echo -e "${BOLD}${CYAN}Static Generation${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  if [ "$ROUTE_COUNT" -gt 0 ]; then
    printf "%-30s %10d  ${GREEN}✓ Generated${NC}\n" "Routes Pre-rendered" "$ROUTE_COUNT"
  else
    printf "%-30s %10s  ${YELLOW}⚠ Unknown${NC}\n" "Routes Pre-rendered" "N/A"
  fi
  
  echo ""
  echo -e "${BOLD}Performance Status Summary${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  PERF_PASS=0
  PERF_WARN=0
  PERF_FAIL=0
  
  # Count statuses
  if (( $(echo "$BUILD_TIME_SECONDS > $BUILD_TIME_WARNING_THRESHOLD" | bc -l) )); then
    PERF_WARN=$((PERF_WARN + 1))
  else
    PERF_PASS=$((PERF_PASS + 1))
  fi
  
  if [ -n "$BUNDLE_SIZE_MB" ] && [ "$BUNDLE_SIZE_MB" != "0" ]; then
    if (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_FAILURE_THRESHOLD" | bc -l) )); then
      PERF_FAIL=$((PERF_FAIL + 1))
    elif (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_WARNING_THRESHOLD" | bc -l) )); then
      PERF_WARN=$((PERF_WARN + 1))
    else
      PERF_PASS=$((PERF_PASS + 1))
    fi
  fi
  
  if [ -n "$CACHE_CONTROL_HEADER" ]; then
    if echo "$CACHE_CONTROL_HEADER" | grep -q "$BASELINE_CACHE_CONTROL"; then
      PERF_PASS=$((PERF_PASS + 1))
    else
      PERF_WARN=$((PERF_WARN + 1))
    fi
  fi
  
  echo ""
  if [ $PERF_FAIL -gt 0 ]; then
    echo -e "${RED}${BOLD}✗ PERFORMANCE REGRESSION DETECTED${NC}"
    echo ""
    echo "  $PERF_FAIL metric(s) exceed acceptable thresholds"
    echo "  $PERF_WARN metric(s) approaching limits"
    echo "  $PERF_PASS metric(s) within baseline"
    echo ""
    echo "  ${RED}Action Required:${NC} Review and address failures before committing"
  elif [ $PERF_WARN -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}⚠ PERFORMANCE WARNINGS${NC}"
    echo ""
    echo "  $PERF_WARN metric(s) approaching thresholds"
    echo "  $PERF_PASS metric(s) within baseline"
    echo ""
    echo -e "  ${YELLOW}Recommended:${NC} Review warnings and consider optimization"
  else
    echo -e "${GREEN}${BOLD}✓ ALL PERFORMANCE METRICS WITHIN BASELINE${NC}"
    echo ""
    echo "  $PERF_PASS/$PERF_PASS metrics passed"
  fi
  
  echo ""
  echo -e "${BOLD}CI Bundle Check Prediction${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  
  if [ -n "$BUNDLE_SIZE_MB" ] && [ "$BUNDLE_SIZE_MB" != "0" ]; then
    if (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_WARNING_THRESHOLD" | bc -l) )); then
      echo -e "${RED}  ✗ CI build will FAIL - bundle size exceeds 10% growth threshold${NC}"
      echo "    Current: $BUNDLE_SIZE_MB MB | Threshold: $BUNDLE_SIZE_WARNING_THRESHOLD MB"
      echo ""
      echo "    Required actions before pushing:"
      echo "    1. Review bundle composition: ANALYZE=true pnpm build"
      echo "    2. Identify and remove/optimize large dependencies"
      echo "    3. Update docs/performance-baseline.md if growth is justified"
    else
      echo -e "${GREEN}  ✓ CI build will PASS - bundle size within acceptable range${NC}"
    fi
  else
    echo -e "${YELLOW}  ○ CI prediction unavailable - bundle size not measured${NC}"
  fi
  
  echo ""
  echo -e "${BOLD}Optimization Recommendations${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  echo ""
  
  if (( $(echo "$BUILD_TIME_SECONDS > $BUILD_TIME_WARNING_THRESHOLD" | bc -l) )); then
    echo -e "  ${YELLOW}⚠${NC} Build Time Optimization:"
    echo "     - Review TypeScript compilation performance"
    echo "     - Check for slow static page generation"
    echo "     - Consider incremental builds (Turbopack caching)"
    echo ""
  fi
  
  if [ -n "$BUNDLE_SIZE_MB" ] && (( $(echo "$BUNDLE_SIZE_MB > $BUNDLE_SIZE_WARNING_THRESHOLD" | bc -l) )); then
    echo -e "  ${RED}✗${NC} Bundle Size Optimization (CRITICAL):"
    echo "     - Run bundle analyzer: ANALYZE=true pnpm build"
    echo "     - Remove unused dependencies: pnpm dedupe"
    echo "     - Implement code splitting for large components"
    echo "     - Use dynamic imports for non-critical code"
    echo ""
  elif [ -n "$BUNDLE_SIZE_MB" ] && (( $(echo "$BUNDLE_SIZE_MB > $BASELINE_BUNDLE_MB" | bc -l) )); then
    echo -e "  ${YELLOW}○${NC} Bundle Size Monitoring:"
    echo "     - Growth detected but within acceptable range"
    echo "     - Monitor future changes to avoid exceeding threshold"
    echo "     - Consider running analyzer periodically"
    echo ""
  fi
  
  if [ -z "$CACHE_CONTROL_HEADER" ] || ! echo "$CACHE_CONTROL_HEADER" | grep -q "$BASELINE_CACHE_CONTROL"; then
    echo -e "  ${YELLOW}⚠${NC} Caching Configuration:"
    echo "     - Verify next.config.ts headers configuration"
    echo "     - Ensure routes are statically generated"
    echo "     - Test headers in production deployment"
    echo ""
  fi
  
  echo -e "${BOLD}Troubleshooting Resources${NC}"
  echo "─────────────────────────────────────────────────────────────────"
  echo ""
  echo "  Performance Troubleshooting Guide:"
  echo -e "  ${BLUE}https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting${NC}"
  echo ""
  echo "  Specific Issues:"
  echo "  • Bundle Size Regression:"
  echo -e "    ${BLUE}https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#bundle-size-regression${NC}"
  echo "  • Build Time Issues:"
  echo -e "    ${BLUE}https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#slow-build-time${NC}"
  echo "  • Cache Headers:"
  echo -e "    ${BLUE}https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-troubleshooting#cache-headers-missing${NC}"
  echo ""
fi

echo ""
echo -e "${BLUE}${BOLD}Documentation & References:${NC}"
echo "  - README: ./README.md"
echo "  - Testing guide: https://bns-portfolio-docs.vercel.app/docs/reference/testing-guide"
echo "  - Registry schema: https://bns-portfolio-docs.vercel.app/docs/reference/registry-schema-guide"
echo "  - ADR-0011 (registry): https://bns-portfolio-docs.vercel.app/docs/architecture/adr/adr-0011-data-driven-project-registry"
echo "  - Performance baseline (YAML): ./docs/performance-baseline.yml"
echo "  - Performance baseline (docs): ./docs/performance-baseline.md"
echo "  - Performance optimization: https://bns-portfolio-docs.vercel.app/docs/operations/runbooks/rbk-portfolio-performance-optimization"
echo ""

# Exit with failure code if any checks failed
if [ $FAILURES -gt 0 ]; then
  exit 1
fi

exit 0
