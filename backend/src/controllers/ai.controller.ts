import type { Request, Response, Express } from "express";
import JSZip from "jszip";
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
      typeof req.body?.job_description === "string"
        ? req.body.job_description.trim()
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
    const cleanResumeText = resumeText.trim();

    if (!cleanResumeText) {
      res.status(400).json({
        error: "Could not extract text from resume",
        message: "Unsupported or unreadable resume format",
      });
      return;
    }

    const result = await llmService.analyzeResume({
      resumeText: cleanResumeText,
      jobDescription,
    });

    res.status(200).json({ resumeText: cleanResumeText, jobDescription, feedback: result });
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    res.status(500).json({
      error: "Failed to analyze resume",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const parseResumeFile = async (file: Express.Multer.File): Promise<string> => {
  const mime = (file.mimetype || "").toLowerCase();
  const name = file.originalname?.toLowerCase() || "";
  const buffer = file.buffer;

  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (mime.includes("wordprocessingml") || name.endsWith(".docx")) {
    return await extractDocxText(buffer);
  }

  if (mime.includes("msword") || name.endsWith(".doc")) {
    return extractDocBinaryText(buffer);
  }

  return buffer.toString("utf8");
};

const extractPdfText = (buffer: Buffer): string => {
  const pdfString = buffer.toString("latin1");
  const matches = pdfString.match(/\(([^()\\]*(?:\\.[^()\\]*)*)\)/g);

  if (!matches) {
    return pdfString.replace(/[^\x20-\x7E\r\n]+/g, " ").replace(/\s+/g, " ");
  }

  const cleaned = matches
    .map((m) => m.slice(1, -1))
    .map((text) =>
      text
        .replace(/\\([nrtbf()\\])/g, (_match, p1) => {
          if (p1 === "n") return "\n";
          if (p1 === "r") return "\r";
          if (p1 === "t") return "\t";
          if (p1 === "b") return "\b";
          if (p1 === "f") return "\f";
          return p1;
        })
        .replace(/\\(\d{1,3})/g, (_m, octal) => {
          const code = parseInt(octal, 8);
          return Number.isFinite(code) ? String.fromCharCode(code) : "";
        }),
    )
    .join(" ");

  return cleaned.replace(/\s+/g, " ");
};

const extractDocBinaryText = (buffer: Buffer): string => {
  return buffer
    .toString("latin1")
    .replace(/[^\x20-\x7E\r\n]+/g, " ")
    .replace(/\s+/g, " ");
};

const extractDocxText = async (buffer: Buffer): Promise<string> => {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const file = zip.file("word/document.xml");
    const xml = file ? await file.async("text") : "";

    if (!xml) {
      return "";
    }

    return xml
      .replace(/<w:p[^>]*>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, " ");
  } catch (error) {
    console.error("Failed to extract DOCX text:", error);
    return "";
  }
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
