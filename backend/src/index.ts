import 'dotenv/config';
import type { Express, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import aiRoutes from './routes/ai.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with increased limit for resumes
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('KeyCV Backend API - AI Toolkit Enabled');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// AI Toolkit API routes
app.use('/api/ai', aiRoutes);

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`AI Toolkit endpoints available at http://localhost:${port}/api/ai`);
});
