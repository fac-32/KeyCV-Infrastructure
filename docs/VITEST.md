# Vitest Unit Testing Setup for KeyCV Backend

## Overview

Set up Vitest unit testing framework for the KeyCV backend API. This includes testing the LLM
service (Anthropic SDK integration), controller functions (file parsing, validation), and
establishing testing infrastructure with proper mocking patterns.

**Scope:** Backend only (`KeyCV-Infrastructure/backend/`) **Test Type:** Unit tests **Framework:**
Vitest (native ESM + TypeScript support)

## Project Context

- **Architecture:** Express v5 + TypeScript + ESM modules
- **Key Dependencies:** @anthropic-ai/sdk, multer, jszip
- **Current State:** No existing test setup
- **Files to Test:**
  - `src/services/llm.service.ts` - LLMService class (4 methods + JSON parsing)
  - `src/controllers/ai.controller.ts` - 4 controller functions + file parsing utilities

## Implementation Steps

### Step 1: Install Dependencies

```bash
cd KeyCV-Infrastructure/backend
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 supertest @types/supertest
```

**Packages:**

- `vitest` - Testing framework with native ESM/TypeScript support
- `@vitest/ui` - Browser UI for viewing test results
- `@vitest/coverage-v8` - Fast V8-based coverage reporting
- `supertest` + `@types/supertest` - HTTP testing for Express endpoints

### Step 2: Create Vitest Configuration

**File:** `backend/vitest.config.ts`

Key configuration:

- Node environment (not browser)
- Global test utilities (`describe`, `it`, `expect`, `vi`)
- V8 coverage provider with 70% thresholds
- Setup file: `src/__tests__/setup.ts`
- Test pattern: `src/**/*.{test,spec}.ts`
- Auto-clear mocks between tests
- Path alias: `@` → `./src`

### Step 3: Update package.json Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Step 4: Create Test Infrastructure

**Directory Structure:**

```text
src/
├── __tests__/
│   ├── setup.ts              # Global setup/teardown
│   ├── mocks/
│   │   ├── anthropic.mock.ts # Anthropic SDK mock factory
│   │   └── express.mock.ts   # Express Request/Response mocks
│   └── fixtures/
│       └── resumes.ts        # Test data (sample resumes, job descriptions)
```

**4a. Create `src/__tests__/setup.ts`**

- Set `NODE_ENV=test`
- Set test `ANTHROPIC_API_KEY`
- Clear mocks after each test

**4b. Create `src/__tests__/mocks/anthropic.mock.ts`**

- Mock factory for Anthropic SDK responses
- Helper: `createMockAnthropicResponse(jsonContent)`

**4c. Create `src/__tests__/mocks/express.mock.ts`**

- Mock factories: `createMockRequest()`, `createMockResponse()`
- Returns mock objects with spies for `status()`, `json()`

**4d. Create `src/__tests__/fixtures/resumes.ts`**

- Sample resume text
- Sample job description
- Mock file buffers (PDF, DOCX helpers)

### Step 5: Write Service Layer Tests

**File:** `src/services/llm.service.test.ts`

**Test Coverage:**

1. **Constructor**
   - ✓ Throws error when ANTHROPIC_API_KEY missing
   - ✓ Initializes client with API key

2. **analyzeResume()**
   - ✓ Returns match score and keywords from JSON response
   - ✓ Handles JSON wrapped in markdown code blocks
   - ✓ Throws error on malformed JSON
   - ✓ Throws error on unexpected response type
   - ✓ Calls Anthropic API with correct parameters

3. **rewriteBulletPoint()**
   - ✓ Returns rewritten bullet point with improvements
   - ✓ Includes original text in response

4. **generateCoverLetter()**
   - ✓ Includes keyPoints in prompt when provided
   - ✓ Works without optional keyPoints
   - ✓ Returns cover letter text

5. **generateInterviewQuestions()**
   - ✓ Includes companyName when provided
   - ✓ Works without optional companyName
   - ✓ Returns technical and behavioral questions

**Mocking Strategy:**

```typescript
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));
```

Mock the `llmService` singleton by mocking at module level, then spy on methods.

### Step 6: Write Controller Layer Tests

**File:** `src/controllers/ai.controller.test.ts`

**Test Coverage:**

1. **analyzeResume()**
   - ✓ Returns 400 when job_description missing
   - ✓ Returns 400 when file missing
   - ✓ Successfully analyzes text resume
   - ✓ Successfully parses DOCX files
   - ✓ Successfully parses PDF files
   - ✓ Returns 400 when extracted text is empty
   - ✓ Returns 500 when LLM service throws error

2. **rewriteBulletPoint()**
   - ✓ Returns 400 when bulletPoint missing
   - ✓ Returns 400 when jobDescription missing
   - ✓ Successfully rewrites bullet point
   - ✓ Returns 500 on service error

3. **generateCoverLetter()**
   - ✓ Validates all required fields
   - ✓ Successfully generates cover letter
   - ✓ Handles optional keyPoints array

4. **generateInterviewQuestions()**
   - ✓ Validates required fields
   - ✓ Successfully generates questions
   - ✓ Handles optional companyName

**Mocking Strategy:**

```typescript
vi.mock("../services/llm.service", () => ({
  llmService: {
    analyzeResume: vi.fn(),
    rewriteBulletPoint: vi.fn(),
    // ... other methods
  },
}));
```

Mock Express Request/Response objects using test utilities.

### Step 7: Verify Setup

```bash
npm run test:watch
```

Start with service tests (simpler, no HTTP), then add controller tests.

### Step 8: Run Coverage Report

```bash
npm run test:coverage
```

Review coverage thresholds (target: 70%+ for services, controllers).

## Critical Files

### Files to Create

1. **`backend/vitest.config.ts`** Main Vitest configuration with Node environment, coverage
   settings, path aliases

2. **`backend/src/__tests__/setup.ts`** Global test setup: environment variables, mock cleanup

3. **`backend/src/__tests__/mocks/anthropic.mock.ts`** Reusable mock factory for Anthropic SDK

4. **`backend/src/__tests__/mocks/express.mock.ts`** Reusable mock factories for Express
   Request/Response

5. **`backend/src/__tests__/fixtures/resumes.ts`** Test data: sample resumes, job descriptions, file
   buffers

6. **`backend/src/services/llm.service.test.ts`** Unit tests for LLMService class (mock Anthropic
   API)

7. **`backend/src/controllers/ai.controller.test.ts`** Unit tests for controller functions (mock LLM
   service)

### Files to Modify

1. **`backend/package.json`** Add test scripts: `test`, `test:watch`, `test:ui`, `test:coverage`

## Key Testing Patterns

### ESM Module Mocking

```typescript
// Mock at module level with factory function
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    /* mock */
  })),
}));
```

### Singleton Service Mocking

```typescript
// Mock the singleton llmService export
vi.mock("../services/llm.service", () => ({
  llmService: { analyzeResume: vi.fn() /* ... */ },
}));
```

### File Buffer Testing

```typescript
const mockFile = {
  buffer: Buffer.from("test content"),
  mimetype: "text/plain",
  originalname: "resume.txt",
} as Express.Multer.File;
```

### Express Mock Pattern

```typescript
const jsonMock = vi.fn();
const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
const mockResponse = { status: statusMock, json: jsonMock };
```

## Important Considerations

1. **ESM Compatibility:** The project uses `"type": "module"` in package.json and imports with `.js`
   extensions. Vitest handles this natively.

2. **Anthropic SDK:** All LLM service tests must mock the SDK - no real API calls in tests.

3. **File Parsing:** Controller tests need realistic file buffers (especially DOCX with JSZip
   structure).

4. **Async Testing:** All controller and service methods are async - use `async/await` in tests.

5. **Error Handling:** Test both success and error paths, including validation errors and API
   failures.

6. **TypeScript Strict Mode:** Project uses strict mode - mock objects should use `Partial<Type>`
   for incomplete objects.

## Success Criteria

- ✓ `npm test` runs all tests successfully
- ✓ Coverage reports show 70%+ coverage for services and controllers
- ✓ All 4 LLM service methods have comprehensive tests
- ✓ All 4 controller functions have validation + success + error tests
- ✓ File parsing functions tested with realistic buffers
- ✓ No real API calls made during testing
- ✓ Tests run fast (<5 seconds total)

## Next Steps After Implementation

1. Add integration tests with Supertest (full HTTP request/response cycle)
2. Add middleware tests (`upload.test.ts` for Multer config)
3. Set up CI/CD to run tests on pull requests
4. Add pre-commit hook to run tests before commits
5. Create `TESTING.md` documentation
