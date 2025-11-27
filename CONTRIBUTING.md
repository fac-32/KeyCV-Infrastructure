# Contributing to KeyCV

We're excited to have you contribute! This document outlines the standards and workflows our team follows to maintain a clean, high-quality, and collaborative development environment.

## 1. Git Branching Workflow

Our branching model is designed to keep our `main` branch stable and our releases predictable. All work should follow this sequence:

1.**Create a Feature Branch:** All new work, including features, bug fixes, and chores, must be done on a separate branch. Branch names should be descriptive and prefixed (e.g., `feature/user-auth`, `fix/login-bug`, `docs/update-readme`).
    ```bash
    # Make sure you are on main and up-to-date
    git checkout main
    git pull origin main

    # Create your new branch
    git checkout -b feature/your-feature-name
    ```

2.**Commit Your Work:** Make small, logical commits. See the "Commit Message Guidelines" section below for how to style your messages.

3.**Open a Pull Request (PR):** When your feature is complete and tested, push your branch to GitHub and open a Pull Request to merge it into the `main` branch. Provide a clear description of the changes in your PR.

4.**Code Review:** At least one other team member must review and approve your PR. This is a crucial step to catch issues, share knowledge, and improve code quality.

5.**Merge to `main`:** Once approved, the PR can be merged into `main`.

6.**Delete Your Feature Branch:** After your PR is merged into `main`, you should delete your local and remote feature branch to keep the repository clean.
    ```bash
    git branch -d your-feature-name # Delete local branch
    git push origin --delete your-feature-name # Delete remote branch
    ```

## 2. Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This makes our Git history readable and helps automate changelogs in the future. Each commit message should be prefixed:

- `feat:` A new feature (e.g., `feat: add user login endpoint`)
- `fix:` A bug fix (e.g., `fix: correct calculation in totals API`)
- `docs:` Documentation only changes (e.g., `docs: update README with setup instructions`)
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor:` A code change that neither fixes a bug nor adds a feature.
- `chore:` Changes to the build process or auxiliary tools (e.g., `chore: update build script`)

## 3. Deployment Process

Our deployment to Replit is automated:

1.**Merge to `main`:** All features must first be merged into the `main` branch.
2.**Update `deploy` Branch:** To release the changes to production, the `deploy` branch is updated by merging `main` into it.
    ```bash
    git checkout deploy
    git pull origin deploy
    git merge main
    git push origin deploy
    ```
3.**Automatic Deployment:** Pushing to the `deploy` branch automatically triggers a new build and release on Replit.

## 4. Frontend & Backend Collaboration

As we move towards frontend integration, our collaboration will be centered around a clear **API Contract**.

1.**Define the Contract First:** Before any implementation, both teams must agree on the API contract. This includes endpoint paths, HTTP methods, and the JSON shapes for requests and responses. We will use **OpenAPI/Swagger** to formally document this contract.
2.**Parallel Development:**
    - **Backend:** Implements the API according to the agreed-upon contract.
    - **Frontend:** Uses the contract to create a **mock server**, allowing them to build and test the UI in parallel without waiting for the backend to be complete.
3.**Integration:** Once the backend API is deployed to a development or staging environment, the frontend can switch from the mock server to the live endpoint for integration testing.
