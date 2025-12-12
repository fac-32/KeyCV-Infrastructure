# Linting & Formatting Guide

## Overview

This project uses a comprehensive code quality setup to maintain consistency across the team. All
checks run automatically via Git hooks, ensuring code quality before it reaches the repository.

**Tools:**

- **ESLint** - TypeScript/JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks manager
- **lint-staged** - Runs linters on staged files only
- **markdownlint** - Markdown file linting
- **EditorConfig** - Cross-editor/OS consistency

## Quick Reference

### What's Configured

1. **ESLint** - TypeScript linting with auto-fix
2. **Prettier** - Code formatting (80 char lines, double quotes, LF endings)
3. **EditorConfig** - Cross-OS/IDE consistency
4. **Husky Git Hooks:**
   - Pre-commit: Formats and lints only staged files (fast!)
   - Pre-push: Runs type-check + tests before push
5. **lint-staged** - Runs linters efficiently on changed files only
6. **markdownlint** - Keeps documentation consistent

### Configuration Files

- `backend/eslint.config.js` - ESLint configuration
- `backend/.prettierrc.json` + `.prettierignore` - Prettier config
- `backend/.editorconfig` - Cross-editor settings
- `backend/.lintstagedrc.json` - Staged file checks
- `backend/.markdownlint.json` - Markdown rules
- `.husky/pre-commit` + `.husky/pre-push` - Git hooks (at repo root)

### Essential Commands

```bash
npm run lint         # Check for linting issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all files with Prettier
npm run type-check   # Run TypeScript type checking
npm run validate     # Run all checks (lint + type-check + test)
```

## For New Developers

### Initial Setup

After cloning the repository and installing dependencies:

```bash
cd backend
npm install
```

This automatically sets up Git hooks via the `prepare` script.

### What Happens Automatically

#### When you commit (`git commit`)

```bash
✓ Formats staged files with Prettier
✓ Lints TypeScript files with ESLint (auto-fixes issues)
✓ Checks markdown files
✓ Blocks commit if unfixable errors exist
```

#### When you push (`git push`)

```bash
✓ Runs TypeScript type checking
✓ Runs test suite
✓ Blocks push if checks fail
```

## Available Commands

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format

# Check if files are formatted (doesn't modify)
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler check without emitting files
npm run type-check
```

### Testing

```bash
# Run tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Browser UI for tests
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Full Validation

```bash
# Run all checks (lint + type-check + test)
npm run validate
```

Use this before pushing to ensure everything passes.

## IDE/Editor Setup

### VS Code

Install recommended extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **EditorConfig** (`editorconfig.editorconfig`)

**Settings (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript"]
}
```

### WebStorm/IntelliJ IDEA

1. Go to **Settings → Languages & Frameworks → JavaScript → Prettier**
2. Enable "On save"
3. Go to **Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint**
4. Enable "Automatic ESLint configuration"
5. Enable "Run eslint --fix on save"

### Vim/Neovim

Use plugins like `ale` or `coc-eslint` + `coc-prettier`.

### Other Editors

Install ESLint, Prettier, and EditorConfig plugins/extensions for your editor.

## Configuration Files Reference

- **`eslint.config.js`** - ESLint rules and TypeScript integration
- **`.prettierrc.json`** - Prettier formatting rules
- **`.prettierignore`** - Files to ignore for formatting
- **`.editorconfig`** - Cross-editor settings (indent, line endings, etc.)
- **`.lintstagedrc.json`** - What runs on staged files (pre-commit)
- **`.markdownlint.json`** - Markdown linting rules
- **`.husky/pre-commit`** - Pre-commit hook script
- **`.husky/pre-push`** - Pre-push hook script

## Troubleshooting

### Git hooks not running

**Problem:** Commits go through without linting/formatting.

**Solution:**

```bash
cd backend
npm run prepare
```

This re-installs the Git hooks.

### ESLint errors during commit

**Problem:** Commit blocked by ESLint errors.

**Solution:**

```bash
# Try auto-fix first
npm run lint:fix

# If that doesn't work, manually fix the reported issues
npm run lint

# Then commit again
git commit -m "Your message"
```

### Prettier conflicts with ESLint

**Problem:** Prettier and ESLint give conflicting rules.

**Solution:** This shouldn't happen - we use `eslint-config-prettier` to disable conflicting rules.
If you see conflicts, please report it to the team.

### Different line endings (Windows vs Mac/Linux)

**Problem:** Git shows files as changed due to line ending differences.

**Solution:** The `.editorconfig` and `.prettierrc.json` enforce LF line endings (`\n`). If you're
on Windows:

```bash
# Configure Git to handle line endings
git config --global core.autocrlf false

# Re-checkout files
git rm --cached -r .
git reset --hard
```

### Skipping hooks (NOT RECOMMENDED)

**Problem:** Need to commit urgently without running checks.

**Solution:** Use `--no-verify` flag:

```bash
# Skip pre-commit hook
git commit -m "WIP" --no-verify

# Skip pre-push hook
git push --no-verify
```

**WARNING:** Only use this for work-in-progress commits on feature branches. NEVER skip hooks when
merging to `main`/`develop`.

## Code Style Guidelines

### TypeScript

- Use `const` for variables that don't change
- Use `let` for variables that do change
- Never use `var`
- Prefer `===` over `==`
- Always use curly braces for `if`/`else`/`for`/`while`
- Avoid `any` type (use `unknown` if type is truly unknown)
- Prefix unused variables with `_` (e.g., `_unusedParam`)

**Examples:**

```typescript
// ✓ Good
const user = { name: "Alice" };
if (user.name === "Alice") {
  console.log("Hello Alice");
}

// ✗ Bad
var user = { name: "Alice" }; // Don't use var
if (user.name == "Alice") console.log("Hello Alice"); // Missing braces and using ==
```

### Code Formatting Rules

- **Indentation:** 2 spaces
- **Line length:** 80 characters (code), 100 (markdown)
- **Semicolons:** Required
- **Quotes:** Double quotes (`"`)
- **Trailing commas:** Always
- **Line endings:** LF (`\n`)

### Comments

- Use `//` for single-line comments
- Use `/** */` for JSDoc documentation comments
- Don't over-comment - code should be self-explanatory
- Do comment complex logic or non-obvious behavior

```typescript
// ✓ Good - explains WHY
// Use latin1 encoding to preserve PDF binary data
const pdfString = buffer.toString("latin1");

// ✗ Bad - explains WHAT (obvious from code)
// Convert buffer to string
const pdfString = buffer.toString("latin1");
```

## Team Workflow

### Before Starting Work

```bash
git pull origin main
cd backend
npm install  # In case dependencies changed
```

### During Development

```bash
# Make changes to code
# ...

# Check if everything is formatted
npm run format:check

# Run tests to ensure nothing broke
npm test

# Check types
npm run type-check
```

### Before Committing

```bash
# Stage your changes
git add .

# Commit (hooks run automatically)
git commit -m "feat: add user authentication"

# If commit fails, fix issues and try again
npm run lint:fix
git commit -m "feat: add user authentication"
```

### Before Pushing

```bash
# Optional: run full validation manually
npm run validate

# Push (pre-push hook runs automatically)
git push origin feature/your-branch
```

## Commit Message Guidelines

Use conventional commit format:

```bash
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, config)

**Examples:**

```bash
git commit -m "feat: add resume analysis endpoint"
git commit -m "fix: handle empty PDF files correctly"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for LLM service"
```

## CI/CD Integration

The same checks that run locally also run in CI/CD:

1. **Linting** - ESLint checks all TypeScript files
2. **Type checking** - TypeScript compiler validates types
3. **Tests** - Full test suite runs
4. **Build** - Ensures code compiles successfully

**If CI/CD fails:**

1. Pull the latest changes: `git pull`
2. Run locally: `npm run validate`
3. Fix any issues
4. Push again

## FAQ

### Q: Why are we using both ESLint and Prettier?

**A:** ESLint catches code quality issues (bugs, bad patterns). Prettier handles code formatting
(spacing, line breaks). They complement each other.

### Q: Can I disable specific ESLint rules?

**A:** Yes, but avoid it unless absolutely necessary. If you must:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = someLibrary();
```

Discuss with the team if a rule should be changed project-wide.

### Q: Do I need to format files manually?

**A:** No! Formatting happens automatically:

1. On save (if you set up your IDE)
2. On commit (via pre-commit hook)

Just write code and let the tools handle formatting.

### Q: What if I'm working on Windows?

**A:** Everything works cross-platform. Just ensure:

- Git is configured correctly (`core.autocrlf false`)
- Your editor uses LF line endings (EditorConfig handles this)
- You have Node.js installed

### Q: Can I run only some checks before committing?

**A:** The pre-commit hook only checks **staged files**, so it's already fast. But you can run
individual commands:

```bash
npm run lint:fix     # Just linting
npm run format       # Just formatting
npm run type-check   # Just type checking
```

## Getting Help

- **Linting errors:** Check this document or run `npm run lint` for details
- **Git hook issues:** Contact the team or check `.husky/` directory
- **Configuration questions:** Review config files in `backend/`
- **General questions:** Ask in the team chat

## Summary

**For developers, the key takeaway is:**

Write code → Stage files → Commit → Tools automatically check everything → Push → CI/CD validates
again

The system catches issues early (locally) so you get fast feedback and avoid broken builds in CI/CD.
