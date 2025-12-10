import { Router } from "express";
import { save } from "../controllers/supabase.controllers.js";

const router = Router();

router.post("/save", save);

export default router;