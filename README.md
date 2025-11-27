# 🔑 KeyCV

This repository houses the backend service for the KeyCV application, designed to automate and improve parts of the job application process. The frontend (if in a separate repository) would consume this backend's APIs.

## Backend Service Overview

The backend service is built with Node.js, Express, and TypeScript. Its primary responsibilities include processing job application data and providing API endpoints for the frontend.

## Tech Stack (Backend)

- ⏱️ **Runtime:** Node.js
- 🖼️ **Framework:** Express.js
- ⚖️ **Language:** TypeScript
- 📦 **Package Manager:** npm

## Setup Instructions

Follow these steps to get the **backend service** running on your local machine.

### 1. Clone the repository

First, clone this entire repository:

```bash
git clone https://github.com/fac-32/KeyCV-Infrastructure.git
cd KeyCV-Infrastructure
```

### 2. Navigate to the Backend Directory

All subsequent backend commands should be run from within the `backend/` directory:

```bash
cd backend
```

### 3. Install Dependencies

Install the necessary Node.js packages for the backend:

```bash
npm install
```

### 4. Environment Variables

Environment variables are crucial for configuring our application. We use a `.env.example` file as a template to define all necessary variables.

For local development, create a `.env.local` file in the `backend/` directory:

```bash
cp .env.example .env.local
```

Then, open `.env.local` and fill in the required environment variables specific to your local setup.

> 🚨 **Warning:** </br>
> **Ensure this file is never committed to Git, as it contains sensitive information.** (It is already ignored by `.gitignore`).


For managing environment variables in the production Replit environment, please refer to the detailed instructions in the [Replit Deployment Guide](docs/deployment.md#21-managing-environment-variables-replit-secrets-vs-local-development).

### 5. Run the Development Server

To start the backend server in development mode with live reloading:

```bash
npm run dev
```

> **Note:**</br>
> The server will typically run on `http://localhost:3000`.

### 6. Build the Project

To compile the TypeScript code of the backend into JavaScript for production:

```bash
npm run build
```

This command compiles the TypeScript source files (`src/`) into JavaScript in the `dist/` directory.

### 7. Start the Production Server

To run the compiled production version of the backend server:

```bash
npm start
```

## Available Scripts (Backend)

These scripts are run from within the `backend/` directory.

- `npm run dev`: Starts the backend server in development mode.
- `npm run build`: Compiles TypeScript to JavaScript for the backend, creating production-ready files in the `dist/` directory.
- `npm start`: Starts the compiled production backend server.
- `npm run test`: Runs tests (currently no tests configured for the backend).

## Contribution Workflow & Branching

All contributions should follow our branching model:

1. **Feature Branches:** Create a new branch from `main` for any new feature or bug fix (e.g., `feature/add-user-auth` or `fix/login-bug`).

2. **Pull Request:** Once your work is complete, open a Pull Request (PR) to merge your feature branch into `main`.

3. **Code Review:** At least one other team member must review and approve the PR.

4. **Merge to `main`:** Once approved, the feature is merged into the `main` branch.

5. **Deployment:** To release the changes, the `main` branch is merged into the `deploy` branch, which is automatically deployed by Replit.

## Deployment

The backend service is deployed on Replit from the `deploy` branch. For detailed instructions on the deployment process, monitoring, and managing the Replit environment, please see our [Replit Deployment Guide](docs/deployment.md).

You can access the live application here:

🔗 [KeyCV](https://replit.com/@trsdeveloper/KeyCV-Infrastructure)

## Project Documentation

All detailed project documentation has been moved to the `docs/` directory to keep the root directory clean.

- **[Project Guidelines](docs/GUIDELINES.md):** High-level project goals, tech stack, and project management approach.
- **[Deployment Guide](docs/deployment.md):** Detailed instructions for deploying the backend service on Replit.
- **[Project Plan Gantt Chart](docs/gantt.html):** A visual representation of our project plan.

## Meet the Team

| Name          | GitHub                                           | Email                   |
|---------------|--------------------------------------------------|-------------------------|
| Kay           | `[add GitHub username]`                          | `[add email]`           |
| Marina        | `[add GitHub username]`                          | `[add email]`           |
| Rafi          | `[add GitHub username]`                          | `[add email]`           |
| Tania Rosa    | [Pinkish-Warrior](https://github.com/Pinkish-Warrior) | `trsdeveloper@proton.me`|

![Human-led - AI-enhanced](https://img.shields.io/badge/🧠%20Human%20Led%20%2D%20🤖%20AI%20Enhanced-success)
