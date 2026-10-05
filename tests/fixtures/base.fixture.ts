/**
 * Base fixture for Milliways SmartTests
 * 
 * Extends Playwright's base fixtures with custom helpers and context
 * for TestChimp integration and application-specific test utilities.
 */

import { test as base } from '@playwright/test';

// Define custom fixture types
type MilliwaysFixtures = {
  // Add custom fixtures here as tests are authored
  // Example: apiClient: ApiClient;
};

// Extend Playwright test with custom fixtures
export const test = base.extend<MilliwaysFixtures>({
  // Fixture implementations will be added during test authoring
});

export { expect } from '@playwright/test';
