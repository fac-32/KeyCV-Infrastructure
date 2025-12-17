import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Global test utilities (no need to import in every test)
    globals: true,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/types/**",
        "src/index.ts", // Entry point, tested via integration
        "node_modules/**",
        "dist/**",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },

    // Test file patterns
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["node_modules/**", "dist/**", "**/*.d.ts"],

    // Setup files
    setupFiles: ["./src/__tests__/setup.ts"],

    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Watch mode options
    watch: false,

    // Clear mocks between tests
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
