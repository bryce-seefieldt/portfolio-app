// Import Playwright test configuration utilities and device presets
import { defineConfig, devices } from '@playwright/test';

// Export the Playwright test configuration
export default defineConfig({
    // Specify the directory where test files are located
    testDir: './tests/e2e',
    
    // Run all tests in parallel (set to false to run sequentially)
    fullyParallel: false,
    
    // Fail the test suite if test.only() is used (enforced in CI environments)
    forbidOnly: !!process.env.CI,
    
    // Retry failed tests: 2 times in CI, 0 times locally
    retries: process.env.CI ? 2 : 0,
    
    // Number of parallel workers: 1 in CI (for stability), unlimited locally
    workers: process.env.CI ? 1 : undefined,
    
    // Generate HTML test report after test run
    reporter: 'html',
    
    // Global settings applied to all tests
    use: {
        // Base URL for tests (use env variable or default to localhost)
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        
        // Record trace (video/screenshots) only on first retry of failed tests
        trace: 'on-first-retry',
    },
    
    // Define browser projects to test against
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
    
    // Start dev server before tests (skip in CI, assume it's already running)
    webServer: process.env.CI
        ? undefined
        : {
                // Command to start the dev server
                command: 'pnpm dev',
                // URL to wait for before starting tests
                url: 'http://localhost:3000',
                // Reuse existing server if already running (except in CI)
                reuseExistingServer: !process.env.CI,
            },
});