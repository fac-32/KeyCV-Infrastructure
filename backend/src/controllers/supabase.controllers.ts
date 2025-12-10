import type { Request, Response } from "express";
import supabase from "../services/supabase.service.js";

export const save = async (req: Request, res: Response):Promise<Response> => {
    const { data, error } = await supabase.from("test_relation").select("*");
    return res.status(200).json({ data });
};