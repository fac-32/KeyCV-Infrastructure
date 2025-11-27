// Type definitions for AI Toolkit API

// Feature 1: Resume and Job Description Analysis
export interface AnalyzeResumeRequest {
  resumeText: string;
  jobDescription: string;
}

export interface AnalyzeResumeResponse {
  matchScore: number; // 0-100
  presentKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

// Feature 2: Resume Bullet Point Rewriter
export interface RewriteBulletPointRequest {
  bulletPoint: string;
  jobDescription: string;
}

export interface RewriteBulletPointResponse {
  originalBulletPoint: string;
  rewrittenBulletPoint: string;
  improvements: string[];
}

// Feature 3: Cover Letter Generation
export interface GenerateCoverLetterRequest {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  keyPoints?: string[] | undefined; // Optional key points to emphasize
}

export interface GenerateCoverLetterResponse {
  coverLetter: string;
}

// Feature 4: Interview Questions Generator
export interface GenerateInterviewQuestionsRequest {
  jobDescription: string;
  jobTitle: string;
  companyName?: string | undefined;
}

export interface GenerateInterviewQuestionsResponse {
  technicalQuestions: string[];
  behavioralQuestions: string[];
}
