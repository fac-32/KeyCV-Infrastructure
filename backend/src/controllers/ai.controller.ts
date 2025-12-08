import type { Request, Response, Express } from "express";
import { llmService } from "../services/llm.service.js";
import type {
  RewriteBulletPointRequest,
  GenerateCoverLetterRequest,
  GenerateInterviewQuestionsRequest,
} from "../types/ai.types.ts";

/**
 * Controller for Feature 1: Resume and Job Description Analysis
 */
export const analyzeResume = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const jobDescription =
      typeof req.body?.jobDescription === "string"
        ? req.body.jobDescription.trim()
        : "";
    const hasFile = Boolean(req.file);

    if (!jobDescription) {
      res
        .status(400)
        .json({ error: "Missing required field: job description (job)" });
      return;
    }

    if (!hasFile) {
      res.status(400).json({
        error: "Missing resume file: provide cv as multipart file field",
      });
      return;
    }

    const resumeText = await parseResumeFile(req.file as Express.Multer.File);

    if (!resumeText) {
      res.status(501).json({
        error: "Resume parsing not implemented yet",
        message: "Add parser to extract text from PDF/DOC/DOCX buffer.",
      });
      return;
    }

    // TODO: when parsing is ready, call the LLM with real resume text.
    // const result = await llmService.analyzeResume({ resumeText, jobDescription });
    // res.status(200).json(result);
    res.status(501).json({
      error: "Analysis pending",
      message:
        "Resume parsing stub in place; wire to LLM after parser is added.",
    });
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    res.status(500).json({
      error: "Failed to analyze resume",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const parseResumeFile = async (_file: Express.Multer.File): Promise<string> => {
  // TODO: implement parsing of PDF/DOC/DOCX from req.file.buffer
  return "";
};

/**
 * Controller for Feature 2: Resume Bullet Point Rewriter
 */
export const rewriteBulletPoint = async (
  req: Request<object, object, RewriteBulletPointRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { bulletPoint, jobDescription } = req.body;

    // Validation
    if (!bulletPoint || !jobDescription) {
      res.status(400).json({
        error: "Missing required fields: bulletPoint and jobDescription",
      });
      return;
    }

    const result = await llmService.rewriteBulletPoint({
      bulletPoint,
      jobDescription,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in rewriteBulletPoint:", error);
    res.status(500).json({
      error: "Failed to rewrite bullet point",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Controller for Feature 3: Cover Letter Generation
 */
export const generateCoverLetter = async (
  req: Request<object, object, GenerateCoverLetterRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { resumeText, jobDescription, companyName, jobTitle, keyPoints } =
      req.body;

    // Validation
    if (!resumeText || !jobDescription || !companyName || !jobTitle) {
      res.status(400).json({
        error:
          "Missing required fields: resumeText, jobDescription, companyName, and jobTitle",
      });
      return;
    }

    const result = await llmService.generateCoverLetter({
      resumeText,
      jobDescription,
      companyName,
      jobTitle,
      keyPoints,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    res.status(500).json({
      error: "Failed to generate cover letter",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Controller for Feature 4: Interview Questions Generator
 */
export const generateInterviewQuestions = async (
  req: Request<object, object, GenerateInterviewQuestionsRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { jobDescription, jobTitle, companyName } = req.body;

    // Validation
    if (!jobDescription || !jobTitle) {
      res.status(400).json({
        error: "Missing required fields: jobDescription and jobTitle",
      });
      return;
    }

    const result = await llmService.generateInterviewQuestions({
      jobDescription,
      jobTitle,
      companyName,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in generateInterviewQuestions:", error);
    res.status(500).json({
      error: "Failed to generate interview questions",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
