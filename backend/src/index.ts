import express, { type Express, type Request, type Response } from 'express';
import path from 'path';

const app: Express = express();
const port = process.env.PORT ?? 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
