import { Router } from 'express';
import {
  analyzeResume,
  rewriteBulletPoint,
  generateCoverLetter,
  generateInterviewQuestions,
} from '../controllers/ai.controller.ts';

const router = Router();

/**
 * Feature 1: Resume and Job Description Analysis
 * POST /api/ai/analyze-resume
 * Body: { resumeText: string, jobDescription: string }
 */
router.post('/analyze-resume', analyzeResume);

/**
 * Feature 2: Resume Bullet Point Rewriter
 * POST /api/ai/rewrite-bullet
 * Body: { bulletPoint: string, jobDescription: string }
 */
router.post('/rewrite-bullet', rewriteBulletPoint);

/**
 * Feature 3: Cover Letter Generation
 * POST /api/ai/generate-cover-letter
 * Body: { resumeText: string, jobDescription: string, companyName: string, jobTitle: string, keyPoints?: string[] }
 */
router.post('/generate-cover-letter', generateCoverLetter);

/**
 * Feature 4: Interview Questions Generator
 * POST /api/ai/generate-interview-questions
 * Body: { jobDescription: string, jobTitle: string, companyName?: string }
 */
router.post('/generate-interview-questions', generateInterviewQuestions);

export default router;
