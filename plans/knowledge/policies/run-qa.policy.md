# Test Execution Policy

## Purpose

Guidelines for running SmartTests locally and in CI environments.

## Local Execution

### Prerequisites

1. **Backend stack running:**
   ```bash
   docker compose up --build -d
   ```
   Verify health: `curl http://localhost:3001/health`

2. **Web dev server:**
   ```bash
   cd web && npm install && npm start
   ```
   Angular app available at `http://localhost:4200`

3. **Environment variables:**
   ```bash
   export TESTCHIMP_API_KEY="your-api-key"
   export TESTCHIMP_PROJECT_ID="your-project-id"
   export TESTCHIMP_BRANCH_NAME="$(git branch --show-current)"
   ```

### Running Tests

From the SmartTests root directory (`tests/`):

```bash
cd tests
npm install
npm run test:web          # Headless Playwright tests
npm run test:web:headed   # Headed mode for debugging
npm run test:web:debug    # Debug mode with Playwright Inspector
```

### Debugging Failed Tests

- Use headed mode to observe browser behavior
- Enable Playwright trace collection for step-by-step replay
- Check TestChimp dashboard for execution history and failure patterns
- Verify the application is running correctly by manual testing first

## CI Execution

Automated test runs are triggered by pull requests via GitHub Actions (`.github/workflows/smarttests.yml`).

### CI Environment

- Runner: `ubuntu-latest`
- Node version: 20
- Browser: Chromium (installed via `npx playwright install --with-deps`)
- Test timeout: 30 minutes per workflow

### Required Secrets

Configure in **GitHub Settings → Secrets and variables → Actions**:

- `TESTCHIMP_API_KEY` — TestChimp authentication
- `TESTCHIMP_PROJECT_ID` — Links runs to the correct TestChimp project

### CI Test Flow

1. Checkout PR branch
2. Start Docker Compose backend (Postgres + API)
3. Wait for API health check
4. Install dependencies (`web/` and `tests/`)
5. Install Playwright browsers
6. Start Angular dev server (background or via webServer config)
7. Run SmartTests with reporter configured
8. Upload artifacts on failure (traces, HTML report)

### Approval Gate

Pull requests **must** pass SmartTests CI checks before merge. Failures require investigation and fix—do not disable or skip tests to force a green check.

## Test Result Reporting

All test runs (local and CI) should report results to TestChimp for:
- Execution history tracking
- Requirement coverage analysis
- Flakiness detection
- TrueCoverage correlation

Ensure the `@testchimp/playwright` reporter is configured in `playwright.config.ts`.

## References

- [connect-to-test-env.policy.md](./connect-to-test-env.policy.md)
- [TESTING_GUIDE.md](../../../guide/TESTING_GUIDE.md)
