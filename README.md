# KeyCV Project

This repository houses the backend service for the KeyCV application, designed to automate and improve parts of the job application process. The frontend (if in a separate repository) would consume this backend's APIs.

## Backend Service Overview

The backend service is built with Node.js, Express, and TypeScript. Its primary responsibilities include processing job application data and providing API endpoints for the frontend.

## Tech Stack (Backend)

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Package Manager:** npm

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

Create a `.env.local` file in the `backend/` directory by copying the `.env.example` file:

```bash
cp .env.example .env.local
```

Then, open `.env.local` and fill in the required environment variables.

### 5. Run the Development Server

To start the backend server in development mode with live reloading:

```bash
npm run dev
```

The server will typically run on `http://localhost:3000`.

### 6. Build the Project

To compile the TypeScript code of the backend into JavaScript:

```bash
npm run build
```

This will output the compiled JavaScript files into the `dist/` directory within `backend/`.

### 7. Start the Production Server

To run the compiled production version of the backend server:

```bash
npm start
```

## Available Scripts (Backend)

These scripts are run from within the `backend/` directory.

*   `npm run dev`: Starts the backend server in development mode.
*   `npm run build`: Compiles TypeScript to JavaScript for the backend.
*   `npm start`: Starts the compiled production backend server.
*   `npm test`: Runs tests (currently no tests configured for the backend).