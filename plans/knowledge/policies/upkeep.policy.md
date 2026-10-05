# Test Maintenance Policy

## Purpose

Guidelines for maintaining test suite health, managing technical debt, and evolving test automation as the application changes.

## Responsibilities

### Test Authors

- Write clear, maintainable test code with descriptive names
- Link tests to scenarios via `// @Scenario: #TS-XXX` annotations
- Document complex test setup or data dependencies
- Fix flaky tests immediately—do not merge intermittent failures

### Code Reviewers

- Verify test coverage for new features before approving PRs
- Check that new tests follow naming conventions and policy guidelines
- Ensure test data is seeded via proper QA endpoints, not hard-coded
- Validate that tests run reliably in CI (check Actions logs)

### QA Platform Admin

- Keep TestChimp project configuration synchronized with repo folder mapping
- Monitor test execution trends and flakiness metrics in TestChimp dashboard
- Update policies when testing strategy evolves
- Ensure CI secrets and environment variables are current

## Maintenance Practices

### Regular Reviews

- **Weekly:** Review failed CI runs and address root causes
- **Monthly:** Audit test coverage gaps via TestChimp Insights
- **Per feature:** Update or add scenarios in TestChimp before implementation

### Refactoring Tests

When refactoring or updating tests:
1. Ensure existing scenario links remain valid
2. Update fixture helpers if data schemas change
3. Run full suite locally before pushing
4. Update related policy documents if execution steps change

### Deprecating Tests

If a test becomes obsolete:
1. Comment with reason and date
2. Remove from active test runs (skip or delete)
3. Archive the scenario in TestChimp (mark as deprecated, do not delete)
4. Document the change in commit message

### Dependency Updates

- Keep Playwright and `@testchimp/playwright` up to date with project requirements
- Test locally after updating critical dependencies
- Update CI workflow if new environment setup steps are needed

## Test Suite Health Metrics

Monitor these indicators in TestChimp:

| Metric | Target | Action Threshold |
|--------|--------|------------------|
| Pass rate | > 95% | < 90% requires immediate investigation |
| Flakiness | < 2% | > 5% triggers quarantine and fix sprint |
| Execution time | < 10 min | > 15 min triggers suite optimization |
| Coverage | > 80% of scenarios | < 70% requires new test authoring |

## References

- [run-qa.policy.md](./run-qa.policy.md)
- [global.policy.md](./global.policy.md)
- TestChimp documentation: [Test maintenance best practices](https://docs.testchimp.io)
