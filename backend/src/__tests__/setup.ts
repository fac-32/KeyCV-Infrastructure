import { beforeAll, afterAll, afterEach, vi } from "vitest";

// Set test environment variables
beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.ANTHROPIC_API_KEY = "test-api-key-" + Math.random();
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

// Final cleanup
afterAll(() => {
  delete process.env.ANTHROPIC_API_KEY;
});
