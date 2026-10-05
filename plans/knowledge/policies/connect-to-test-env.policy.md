# Connect to Test Environment Policy

## Purpose

This policy documents how to connect to and validate the Milliways test environment for local development and CI execution.

## Local Test Environment

### Architecture

The Milliways demo application consists of:
- **Backend:** Node.js API + PostgreSQL database (Docker Compose)
- **Web:** Angular 19 SPA served via `ng serve`
- **API Proxy:** Angular dev server proxies `/api/*` requests to backend

### Starting the Environment

#### 1. Start Backend Stack

From the repository root:

```bash
docker compose up --build -d
```

This starts:
- PostgreSQL on `localhost:5432` (database: `milliways`, user: `milliways`, password: `milliways`)
- Node.js API on `localhost:3001`

#### 2. Wait for Health Check

Verify the API is ready:

```bash
curl -f http://localhost:3001/health
```

Expected response: HTTP 200 with JSON body indicating healthy status.

**Automated wait script:** Use `./scripts/qa/local-up.sh` to start Docker Compose and wait for health.

#### 3. Start Angular Dev Server

From `web/` directory:

```bash
cd web
npm install
npm start
```

The Angular CLI starts a development server on `http://localhost:4200`.

**Wait criteria:** Server is ready when you see:
```
** Angular Live Development Server is listening on localhost:4200 **
```

### Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Web UI | `http://localhost:4200` | Angular SPA (use this as `BASE_URL` for tests) |
| Backend API | `http://localhost:3001` | Direct API access (health checks, QA seed endpoints) |
| Postgres | `localhost:5432` | Database (for migrations, seed data inspection) |

### API Proxy Configuration

The Angular dev server proxies API requests to the backend via `web/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

This means:
- Frontend code calls `/api/menu`, `/api/orders`, etc.
- Angular dev server forwards to `http://localhost:3001/api/*`
- Tests targeting `http://localhost:4200` automatically hit the correct backend

### Environment Variables for Tests

Set these in your shell before running SmartTests:

```bash
export BASE_URL="http://localhost:4200"
export TESTCHIMP_API_KEY="your-api-key"
export TESTCHIMP_PROJECT_ID="your-project-id"
export TESTCHIMP_BRANCH_NAME="$(git branch --show-current)"
```

The `BASE_URL` is typically configured in `playwright.config.ts` as the base URL for all tests.

## CI Test Environment

### GitHub Actions Strategy

The CI workflow (`.github/workflows/smarttests.yml`) replicates the local setup on GitHub-hosted runners:

#### Setup Steps

1. **Checkout code:** `actions/checkout@v4`
2. **Install Node.js:** `actions/setup-node@v4` with Node 20
3. **Start backend:**
   ```bash
   docker compose up --build -d
   ```
   Or use `./scripts/qa/local-up.sh` for health polling
4. **Install dependencies:**
   ```bash
   cd web && npm ci
   cd ../tests && npm ci
   ```
5. **Install Playwright browsers:**
   ```bash
   cd tests && npx playwright install --with-deps chromium
   ```
6. **Start Angular dev server:**
   - Option A: Start `npm start` in background with wait-for-ready polling
   - Option B: Use Playwright's `webServer` config in `playwright.config.ts` (recommended)

#### Environment Variables in CI

Set via GitHub Actions secrets and workflow `env`:

```yaml
env:
  BASE_URL: "http://localhost:4200"
  TESTCHIMP_API_KEY: ${{ secrets.TESTCHIMP_API_KEY }}
  TESTCHIMP_PROJECT_ID: ${{ secrets.TESTCHIMP_PROJECT_ID }}
  CI: "true"
```

The `CI=true` flag helps tests and reporters adapt behavior for CI environments.

### CI Execution Flow

```
┌─────────────────────┐
│ Start Docker        │
│ Compose (postgres   │
│ + API)              │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ Wait for            │
│ /health endpoint    │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ Start Angular       │
│ dev server          │
│ (localhost:4200)    │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ Run Playwright      │
│ SmartTests          │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ Upload artifacts    │
│ (on failure)        │
└─────────────────────┘
```

### Networking in CI

- All services run on the same GitHub Actions runner (`localhost`)
- No external dependencies or cloud staging required for baseline tests
- Backend database is ephemeral (destroyed after workflow completes)

### Health Check Verification

The workflow must verify backend health before running tests:

```bash
# Inline health poll example
for i in {1..30}; do
  if curl -sf http://localhost:3001/health > /dev/null; then
    echo "API is healthy"
    exit 0
  fi
  echo "Waiting for API... ($i/30)"
  sleep 2
done
echo "API did not become healthy in time"
exit 1
```

Or use the existing `./scripts/qa/local-up.sh` script which includes this logic.

## Troubleshooting

### Common Issues

| Problem | Diagnosis | Solution |
|---------|-----------|----------|
| API not responding | Docker Compose failed to start | Check `docker compose logs api` |
| Tests timing out | Angular dev server not ready | Verify `http://localhost:4200` loads in browser |
| Connection refused | Port conflict | Kill processes using 3001 or 4200 |
| Database errors | Migration not applied | Backend applies migrations on startup; check API logs |

### Verification Checklist

Before running tests, confirm:

- [ ] `docker compose ps` shows `api` and `postgres` healthy
- [ ] `curl http://localhost:3001/health` returns 200 OK
- [ ] `curl http://localhost:4200` returns Angular `index.html`
- [ ] Environment variables are set (`echo $TESTCHIMP_API_KEY`)

## References

- [run-qa.policy.md](./run-qa.policy.md) — Full test execution guidelines
- [README.md](../../../README.md) — Application setup overview
- [guide/TESTING_GUIDE.md](../../../guide/TESTING_GUIDE.md) — TestChimp training walkthrough
- [scripts/qa/local-up.sh](../../../scripts/qa/local-up.sh) — Automated startup script
