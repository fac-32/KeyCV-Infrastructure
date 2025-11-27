# KeyCV Backend

This repository contains the backend service for the KeyCV application, built with Node.js, Express, and TypeScript.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Package Manager:** npm

## Setup Instructions

Follow these steps to get the backend running on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/fac-32/KeyCV-Infrastructure.git
cd KeyCV-Infrastructure/backend
```

### 2. Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the `backend/` directory by copying the `.env.example` file:

```bash
cp .env.example .env.local
```

Then, open `.env.local` and fill in the required environment variables.

### 4. Run the Development Server

To start the server in development mode with live reloading:

```bash
npm run dev
```

The server will typically run on `http://localhost:3000`.

### 5. Build the Project

To compile the TypeScript code into JavaScript:

```bash
npm run build
```

This will output the compiled JavaScript files into the `dist/` directory.

### 6. Start the Production Server

To run the compiled production version of the server:

```bash
npm start
```

## Available Scripts

* `npm run dev`: Starts the server in development mode.
* `npm run build`: Compiles TypeScript to JavaScript.
* `npm start`: Starts the compiled production server.
* `npm test`: Runs tests (currently no tests configured).
