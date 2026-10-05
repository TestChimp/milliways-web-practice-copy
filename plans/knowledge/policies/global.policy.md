# Global Testing Policy

## Purpose

This policy defines cross-cutting testing guidelines applicable to all test automation and quality assurance activities for the Milliways demo application.

## Scope

Applies to:
- SmartTests (Playwright web automation)
- Manual exploratory testing
- CI/CD pipeline test execution
- TrueCoverage instrumentation and analytics

## Principles

### 1. Requirement Traceability

All test scenarios must link to user stories and requirements defined in TestChimp. Use `// @Scenario: #TS-XXX` annotations in test code to maintain traceability.

### 2. Test Data Management

- Use **seed endpoints** (QA-only routes under `/qa/*`) to create deterministic test data
- Never hard-code production data or credentials in tests
- Clean up test data when feasible, or design for idempotent test runs

### 3. Environment Isolation

- Local development: Docker Compose stack + local dev servers
- CI: Ephemeral environments per PR
- Never run automated tests against shared staging or production environments without explicit approval

### 4. Reliability Standards

- Tests must pass consistently in headless CI mode
- Flaky tests must be fixed or quarantined — do not merge failing or intermittent tests
- Use proper wait strategies (network idle, element visibility) instead of hard sleeps

### 5. Accessibility & Semantics

- Prefer `aria-label`, `data-testid`, and semantic role selectors over brittle CSS classes
- Validate keyboard navigation and screen reader compatibility when testing new features

### 6. Coverage Goals

- Each user story should have at least one automated scenario covering the happy path
- Critical flows (auth, checkout, order placement) require both positive and negative test cases
- Use TrueCoverage analytics to identify untested user journeys

## References

- [TESTING_GUIDE.md](../../../guide/TESTING_GUIDE.md)
- TestChimp documentation: [docs.testchimp.io](https://docs.testchimp.io)
