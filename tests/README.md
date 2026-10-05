# Milliways SmartTests

Playwright-based end-to-end tests for the Milliways demo application, integrated with TestChimp for requirement traceability and analytics.

## Structure

```
tests/
├── .testchimp-tests          # TestChimp marker file (project_type: web)
├── playwright.config.ts      # Playwright configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── fixtures/                 # Custom fixtures and test helpers
│   ├── base.fixture.ts       # Base fixture with TestChimp integration
│   └── index.ts              # Fixture barrel
└── specs/                    # Test specs (to be authored)
    └── .gitkeep              # Placeholder for test files
```

## Setup

### Prerequisites

1. **Backend running:** `docker compose up -d` from repo root
2. **Environment variables:**
   ```bash
   export TESTCHIMP_API_KEY="your-api-key"
   export TESTCHIMP_PROJECT_ID="your-project-id"
   export TESTCHIMP_BRANCH_NAME="$(git branch --show-current)"
   ```

### Install Dependencies

```bash
npm install
npx playwright install chromium --with-deps
```

## Running Tests

```bash
# Headless mode (CI-style)
npm run test:web

# Headed mode (see browser)
npm run test:web:headed

# Debug mode (Playwright Inspector)
npm run test:web:debug

# UI mode (interactive test runner)
npm run test:web:ui
```

## Configuration

### Base URL

Tests target `http://localhost:4200` by default (configured in `playwright.config.ts`). Override via `BASE_URL` environment variable:

```bash
BASE_URL=http://localhost:8080 npm run test:web
```

### Web Server

The `webServer` option in `playwright.config.ts` automatically starts the Angular dev server before tests run. To disable (if starting manually):

1. Comment out the `webServer` block in `playwright.config.ts`
2. Start `npm start` in `web/` directory before running tests

### Browsers

Tests run in Chromium by default. Uncomment additional projects in `playwright.config.ts` to test Firefox or WebKit.

## Test Authoring

### Structure

Organize tests by feature area:

```
specs/
├── auth/
│   ├── sign-in.spec.ts
│   └── sign-up.spec.ts
├── menu/
│   └── browse-menu.spec.ts
├── cart/
│   └── checkout.spec.ts
└── account/
    └── order-history.spec.ts
```

### Scenario Linking

Link tests to TestChimp scenarios with `@Scenario` annotations:

```typescript
// @Scenario: #TS-101
test('User can sign in with valid credentials', async ({ page }) => {
  // Test implementation
});
```

### Fixtures

Import test helpers from the fixture barrel:

```typescript
import { test, expect } from '../fixtures';

test('example test', async ({ page }) => {
  // Use custom fixtures defined in fixtures/
});
```

## CI Integration

Tests run automatically on pull requests via `.github/workflows/smarttests.yml`. See `../plans/knowledge/policies/run-qa.policy.md` for CI execution details.

## Reporting

### Local Reports

View the HTML report after test runs:

```bash
npm run test:report
```

### TestChimp Integration

Results are uploaded to TestChimp when the `@testchimp/playwright` reporter is configured and `TESTCHIMP_API_KEY` is set. View execution history and coverage in the TestChimp dashboard.

## Troubleshooting

### Tests Timing Out

- Verify backend is running: `curl http://localhost:3001/health`
- Verify Angular dev server is ready: `curl http://localhost:4200`
- Check `webServer` logs in test output

### Connection Errors

- Ensure no port conflicts on 3001 or 4200
- Check Docker Compose status: `docker compose ps`
- Review Docker logs: `docker compose logs api`

### Flaky Tests

- Use proper wait strategies (`page.waitForLoadState()`, `expect(locator).toBeVisible()`)
- Avoid hard `setTimeout()` calls
- Increase `actionTimeout` in `playwright.config.ts` if needed

## References

- [Playwright Documentation](https://playwright.dev)
- [TestChimp SmartTests Guide](https://docs.testchimp.io/smarttests)
- [Testing Guide](../guide/TESTING_GUIDE.md)
- [Run QA Policy](../plans/knowledge/policies/run-qa.policy.md)
