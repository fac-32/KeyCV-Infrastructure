# Replit Deployment Guide for KeyCV Backend

This document provides instructions and best practices for deploying the KeyCV backend service on Replit, aiming to ensure smooth deployments and minimize conflicts within the team.

## 1. Replit Deployment Overview

Replit automates the deployment process based on configurations in your `.replit` file and settings within the Replit UI. When you push changes to our linked GitHub repository, Replit can automatically fetch the updates and redeploy your application.

Your project's `.replit` file is configured with two main workflows(2025-11-26):

- **Backend Server (Production)**: This workflow (`npm install`, `npm run build`, `npm start`) is typically triggered when the "Run" button is pressed, or when Replit performs an automatic deployment. It builds your TypeScript code and starts the production server.
- **Dev**: This workflow (`npm install`, `npm run dev`) is for local development within the Replit environment, utilizing `nodemon` for live reloading.

## 2. Key Deployment Practices

### 2.1. Environment Variables (Secrets)

**DO NOT** commit `.env` files (like `.env.local`) to your repository. Instead, use Replit's built-in **Secrets** manager.

- **How to use:** In your Replit workspace, navigate to the "Tools" sidebar (usually the padlock icon). Here you can add environment variables (e.g., `PORT`, `DB_CONNECTION_STRING` `OPENAI_API_KEY`).

- **Access in Code:** Your Node.js application can access these variables using `process.env.VARIABLE_NAME`.

### 2.2. Git Integration and Branching

Replit can be configured to deploy directly from a Git branch.

- **Connect to GitHub:** Ensure your Replit project is linked to your GitHub repository.
- **Deployment Branch:** In Replit's UI, you can specify which branch (e.g., `main` or `deploy`) Replit should use for automatic deployments. This ensures that only reviewed and stable code is deployed to production.

- **Workflow:**
    1\. Work on feature branches locally or in your Replit fork/dev environment.
    2\. Create Pull Requests (PRs) to merge into your designated deployment branch (e.g., `main`).
    3\. Once the PR is merged, Replit will detect the changes and initiate a new deployment.

### 2.3. Health Check Endpoint

We've added a `/health` endpoint to the backend (`src/index.ts`). This is crucial for deployment monitoring:

- **Purpose:** A lightweight endpoint that simply returns `{ status: 'ok' }` and a 200 HTTP status code.
- **How Replit Uses It:** Replit (or external monitoring tools) can periodically hit this endpoint to confirm the application is running and responsive. If it fails, Replit can attempt to restart your server or alert you to an issue.

### 2.4. Addressing Cache-Busting Comments (e.g., `// Cache-busting comment`)

You might have noticed comments like `// Cache-busting comment to force Replit to update.` in `src/index.ts`. This is a workaround sometimes used when Replit doesn't pick up file changes correctly.

**To avoid needing this:**

- **Ensure Proper `build` Script**: Your `package.json` `build` script (`tsc && copyfiles -u 1 src/public/**/* dist`) is good as it compiles TypeScript and copies public assets. Make sure this script runs correctly during deployment.
- **Re-run `npm install`**: Sometimes, Replit's cached `node_modules` can cause issues. Ensure `npm install` is part of your deployment workflow (it is in your `.replit` file under `Backend Server`).
- **Force Replit Refresh**: If changes aren't reflected, try using the "Restart" button in Replit, or manually clearing the cache if available in Replit's advanced settings (less common).
- **File Sync Issues**: Occasionally, Replit might have issues syncing files. A `git pull` from the Replit shell followed by a restart can resolve this.

## 3. Preventing Conflicts (Team Collaboration)

### 3.1. Clear Branching Strategy

Adhere to the branching strategy outlined in `GUIDELINES.md` (e.g., feature branches -> `main` -> `deploy`).

- **Work on Separate Branches**: Each developer should work on their own feature branch. Never commit directly to `main` or the deployment branch.
- **Pull Requests (PRs)**: All code changes must go through a PR process, requiring review and approval from at least one other team member before merging.

### 3.2. GitHub Branch Protection Rules

Configure your GitHub repository to protect critical branches (`main`, `deploy`).

- **Require PRs**: Mandate that all changes to these branches must come via a Pull Request.
- **Require Approvals**: Set a minimum number of approving reviews (e.g., 1 or 2) before a PR can be merged.
- **Status Checks**: Require status checks to pass (e.g., CI tests, linting) before merging.

### 3.3. Continuous Integration (CI)

As mentioned in `GUIDELINES.md`, set up GitHub Actions to automatically run tests and linting whenever code is pushed to a PR branch.

- **Automated Testing**: Ensure `vitest` and `playwright` tests run automatically.
- **Linting/Formatting**: Use linters (like ESLint for TypeScript) to enforce code style and catch potential issues early.

### 3.4. Regular Communication

Synchronize with the team regularly. If multiple people are working on related features, communicate to avoid overlapping changes that could lead to merge conflicts.

By following these practices, our team can leverage Replit for quick deployments while maintaining code quality and preventing common collaboration pitfalls.
