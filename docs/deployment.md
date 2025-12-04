# Render Deployment Guide for KeyCV Backend

This document provides instructions and best practices for deploying the KeyCV backend service on Render, aiming to ensure smooth deployments and minimize conflicts within the team.

## 1. Overview

- **Service type:** Web Service
- **Root directory:** `backend`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Health check path:** `/health`
- **Recommended Node version:** set `NODE_VERSION=20` (or higher) in Render environment variables.

## 2. Prerequisites

- Render account with access to the KeyCV-Infrastructure repository.
- Anthropic API key for production (`ANTHROPIC_API_KEY`).
- Git branch to deploy (e.g., `main` or `deploy`).

## 3. Provisioning the service

1. In Render, create a **New Web Service** and connect the GitHub repository.
2. Select the branch to deploy.
3. Set **Root Directory** to `backend` so Render installs dependencies and runs commands from there.
4. Use the build and start commands from the overview above.
5. Configure environment variables:
   - `ANTHROPIC_API_KEY` (required)
   - `NODE_VERSION=20` (recommended)
   - `PORT` (optional locally; Render injects this automatically)
   - `DB_CONNECTION_STRING` (optional, if you add a database later)
6. Create the service and wait for the first deploy to finish.

## 4. Post-deploy verification

- Check Render logs to confirm the server starts and binds to `0.0.0.0` on the provided `PORT`.
- Hit the health endpoint: `curl https://<your-service>.onrender.com/health` should return `{ "status": "ok" }`.
- Sanity-test an API endpoint, e.g. POST `/api/ai/analyze-resume` with sample payload.

## 5. Operational notes

- Redeploys are triggered by pushes to the selected branch. Use PRs to control what ships.
- Keep secrets in Render, not in git. Copy values from `.env.example` into Render's dashboard.
- The server already uses generous body limits (`10mb`) for resume uploads; adjust if Render logs indicate issues.
