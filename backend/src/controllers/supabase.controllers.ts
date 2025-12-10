import type { Request, Response } from "express";
import supabase from "../services/supabase.service.js";

export const save = async (req: Request, res: Response):Promise<Response> => {
    const { resume, jobDescription, feedback, cvName } = req.body;
    //const { data, error } = await supabase.from("test_relation").select("*");
    return res.status(200).json({ message: "received files to save" });
};