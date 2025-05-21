import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here if required
});
