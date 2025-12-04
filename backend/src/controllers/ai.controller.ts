import type { Request, Response } from 'express';
import { llmService } from '../services/llm.service.js';
import type {
  AnalyzeResumeRequest,
  RewriteBulletPointRequest,
  GenerateCoverLetterRequest,
  GenerateInterviewQuestionsRequest,
} from '../types/ai.types.ts';

/**
 * Controller for Feature 1: Resume and Job Description Analysis
 */
export const analyzeResume = async (
  req: Request<object, object, AnalyzeResumeRequest>,
  res: Response
): Promise<void> => {
  try {
    const { resumeText, jobDescription } = req.body;

    // Validation
    if (!resumeText || !jobDescription) {
      res.status(400).json({
        error: 'Missing required fields: resumeText and jobDescription',
      });
      return;
    }

    const result = await llmService.analyzeResume({
      resumeText,
      jobDescription,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    res.status(500).json({
      error: 'Failed to analyze resume',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Controller for Feature 2: Resume Bullet Point Rewriter
 */
export const rewriteBulletPoint = async (
  req: Request<object, object, RewriteBulletPointRequest>,
  res: Response
): Promise<void> => {
  try {
    const { bulletPoint, jobDescription } = req.body;

    // Validation
    if (!bulletPoint || !jobDescription) {
      res.status(400).json({
        error: 'Missing required fields: bulletPoint and jobDescription',
      });
      return;
    }

    const result = await llmService.rewriteBulletPoint({
      bulletPoint,
      jobDescription,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in rewriteBulletPoint:', error);
    res.status(500).json({
      error: 'Failed to rewrite bullet point',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Controller for Feature 3: Cover Letter Generation
 */
export const generateCoverLetter = async (
  req: Request<object, object, GenerateCoverLetterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { resumeText, jobDescription, companyName, jobTitle, keyPoints } =
      req.body;

    // Validation
    if (!resumeText || !jobDescription || !companyName || !jobTitle) {
      res.status(400).json({
        error:
          'Missing required fields: resumeText, jobDescription, companyName, and jobTitle',
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
    console.error('Error in generateCoverLetter:', error);
    res.status(500).json({
      error: 'Failed to generate cover letter',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Controller for Feature 4: Interview Questions Generator
 */
export const generateInterviewQuestions = async (
  req: Request<object, object, GenerateInterviewQuestionsRequest>,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription, jobTitle, companyName } = req.body;

    // Validation
    if (!jobDescription || !jobTitle) {
      res.status(400).json({
        error: 'Missing required fields: jobDescription and jobTitle',
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
    console.error('Error in generateInterviewQuestions:', error);
    res.status(500).json({
      error: 'Failed to generate interview questions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
