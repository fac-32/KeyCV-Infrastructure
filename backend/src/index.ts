// Cache-busting comment to force Replit to update.
// Force cache invalidation for Replit deployment
import type { Express, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = process.env.PORT ?? 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
