import "dotenv/config";
import type { Express, Request, Response } from "express";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import supabaseRoutes from "./routes/supabase.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = process.env.PORT ?? 3000;
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// AI Toolkit API routes
app.use("/api/ai", aiRoutes);

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with increased limit for resumes
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Supabase routes
app.use("/api/supabase", supabaseRoutes);

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("KeyCV Backend API - AI Toolkit Enabled");
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});


app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(
    `AI Toolkit endpoints available at http://localhost:${port}/api/ai`,
  );
});
