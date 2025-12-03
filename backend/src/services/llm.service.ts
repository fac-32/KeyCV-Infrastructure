import Anthropic from '@anthropic-ai/sdk';
import type {
  AnalyzeResumeRequest,
  AnalyzeResumeResponse,
  RewriteBulletPointRequest,
  RewriteBulletPointResponse,
  GenerateCoverLetterRequest,
  GenerateCoverLetterResponse,
  GenerateInterviewQuestionsRequest,
  GenerateInterviewQuestionsResponse,
} from '../types/ai.types.js';

export class LLMService {
  private client: Anthropic;
  // Using Haiku as Sonnet is currently inaccessible for this account.
  // The intended model is 'claude-3-5-sonnet-20240620'.
  private model = 'claude-3-haiku-20240307';

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Feature 1: Analyze resume against job description
   */
  async analyzeResume(
    request: AnalyzeResumeRequest
  ): Promise<AnalyzeResumeResponse> {
    const prompt = `Analyze the following job description and extract the top 15 most important keywords, skills, and qualifications. Then, review the provided resume to see which of those keywords are present and which are missing. Provide a clear "match score" (0-100%) and a concise list of the top 5-10 missing keywords the user should consider adding or emphasizing in their resume for this specific job.

JOB DESCRIPTION:
${request.jobDescription}

RESUME:
${request.resumeText}

Respond in JSON format with the following structure:
{
  "matchScore": <number 0-100>,
  "presentKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return this.parseJSONResponse<AnalyzeResumeResponse>(content.text);
  }

  /**
   * Feature 2: Rewrite resume bullet point
   */
  async rewriteBulletPoint(
    request: RewriteBulletPointRequest
  ): Promise<RewriteBulletPointResponse> {
    const prompt = `Rewrite the following resume bullet point to be more impactful and results-oriented, ideally using the STAR method (Situation, Task, Action, Result). Tailor the language to better match the provided job description and emphasize strong action verbs.

ORIGINAL BULLET POINT:
${request.bulletPoint}

JOB DESCRIPTION:
${request.jobDescription}

Respond in JSON format with the following structure:
{
  "originalBulletPoint": "${request.bulletPoint}",
  "rewrittenBulletPoint": "<your rewritten version>",
  "improvements": ["improvement1", "improvement2", ...]
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return this.parseJSONResponse<RewriteBulletPointResponse>(content.text);
  }

  /**
   * Feature 3: Generate tailored cover letter
   */
  async generateCoverLetter(
    request: GenerateCoverLetterRequest
  ): Promise<GenerateCoverLetterResponse> {
    const keyPointsText = request.keyPoints?.length
      ? `\n\nPlease emphasize these key points:\n${request.keyPoints.join('\n')}`
      : '';

    const prompt = `Write a professional, three-paragraph cover letter for the ${request.jobTitle} role at ${request.companyName}. Using the provided resume and job description, create a compelling narrative that highlights the candidate's most relevant skills and experiences. The tone should be enthusiastic, professional, and directly address the job requirements.${keyPointsText}

RESUME:
${request.resumeText}

JOB DESCRIPTION:
${request.jobDescription}

Respond in JSON format with the following structure:
{
  "coverLetter": "<your cover letter text>"
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return this.parseJSONResponse<GenerateCoverLetterResponse>(content.text);
  }

  /**
   * Feature 4: Generate interview preparation questions
   */
  async generateInterviewQuestions(
    request: GenerateInterviewQuestionsRequest
  ): Promise<GenerateInterviewQuestionsResponse> {
    const companyText = request.companyName
      ? `at ${request.companyName}`
      : '';

    const prompt = `Based on this job description for a ${request.jobTitle} ${companyText}, generate a list of 10 likely interview questions. Include at least 5 technical questions directly related to the required skills and technologies, and 5 behavioral questions related to the role's responsibilities and company culture.

JOB DESCRIPTION:
${request.jobDescription}

Respond in JSON format with the following structure:
{
  "technicalQuestions": ["question1", "question2", ...],
  "behavioralQuestions": ["question1", "question2", ...]
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return this.parseJSONResponse<GenerateInterviewQuestionsResponse>(
      content.text
    );
  }

  /**
   * Helper method to parse JSON from Claude's response
   */
  private parseJSONResponse<T>(text: string): T {
    // Claude sometimes wraps JSON in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    const jsonText = (jsonMatch && jsonMatch[1]) ? jsonMatch[1] : text;

    try {
      return JSON.parse(jsonText) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Export a singleton instance
export const llmService = new LLMService();
