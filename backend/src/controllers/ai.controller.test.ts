/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import {
  analyzeResume,
  rewriteBulletPoint,
  generateCoverLetter,
  generateInterviewQuestions,
} from "./ai.controller.js";
import { llmService } from "../services/llm.service.js";
import JSZip from "jszip";

// Mock the LLM service
vi.mock("../services/llm.service.js", () => ({
  llmService: {
    analyzeResume: vi.fn(),
    rewriteBulletPoint: vi.fn(),
    generateCoverLetter: vi.fn(),
    generateInterviewQuestions: vi.fn(),
  },
}));

describe("AI Controller", () => {
  let mockRequest: any;
  let mockResponse: any;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock Express objects
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    vi.clearAllMocks();
  });

  describe("analyzeResume", () => {
    it("should return 400 when job description is missing", async () => {
      mockRequest = {
        body: {},
        file: undefined,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Missing required field: job description (job)",
      });
    });

    it("should return 400 when file is missing", async () => {
      mockRequest = {
        body: { job_description: "Looking for a developer" },
        file: undefined,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Missing resume file: provide cv as multipart file field",
      });
    });

    it("should successfully analyze a text resume", async () => {
      const mockFile = {
        buffer: Buffer.from("John Doe\nSoftware Engineer"),
        mimetype: "text/plain",
        originalname: "resume.txt",
      } as any;

      const mockAnalysis = {
        matchScore: 85,
        presentKeywords: ["Software"],
        missingKeywords: ["TypeScript"],
        recommendations: ["Add TypeScript"],
      };

      vi.mocked(llmService.analyzeResume).mockResolvedValue(mockAnalysis);

      mockRequest = {
        body: { job_description: "Looking for TypeScript developer" },
        file: mockFile,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(llmService.analyzeResume).toHaveBeenCalledWith({
        resumeText: "John Doe\nSoftware Engineer",
        jobDescription: "Looking for TypeScript developer",
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      const expectedResponse = {
        resumeText: "John Doe\nSoftware Engineer",
        jobDescription: "Looking for TypeScript developer",
        feedback: mockAnalysis,
      };
      expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
    });

    it("should handle DOCX files", async () => {
      // Create a minimal valid DOCX (ZIP with document.xml)
      const zip = new JSZip();
      zip.file("word/document.xml", "<w:p>Test Resume Content</w:p>");
      const buffer = await zip.generateAsync({ type: "nodebuffer" });

      const mockFile = {
        buffer,
        mimetype:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        originalname: "resume.docx",
      } as any;

      vi.mocked(llmService.analyzeResume).mockResolvedValue({
        matchScore: 80,
        presentKeywords: [],
        missingKeywords: [],
        recommendations: [],
      });

      mockRequest = {
        body: { job_description: "Test job" },
        file: mockFile,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(llmService.analyzeResume).toHaveBeenCalled();
      const callArg = vi.mocked(llmService.analyzeResume).mock.calls[0]?.[0];
      expect(callArg?.resumeText).toContain("Test Resume Content");
    });

    it("should return 400 when extracted text is empty", async () => {
      const mockFile = {
        buffer: Buffer.from(""),
        mimetype: "text/plain",
        originalname: "empty.txt",
      } as any;

      mockRequest = {
        body: { job_description: "Test" },
        file: mockFile,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Could not extract text from resume",
        message: "Unsupported or unreadable resume format",
      });
    });

    it("should return 500 when LLM service throws error", async () => {
      const mockFile = {
        buffer: Buffer.from("Valid resume"),
        mimetype: "text/plain",
        originalname: "resume.txt",
      } as any;

      vi.mocked(llmService.analyzeResume).mockRejectedValue(
        new Error("API rate limit exceeded"),
      );

      mockRequest = {
        body: { job_description: "Test" },
        file: mockFile,
      };

      await analyzeResume(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Failed to analyze resume",
        message: "API rate limit exceeded",
      });
    });
  });

  describe("rewriteBulletPoint", () => {
    it("should return 400 when bulletPoint is missing", async () => {
      mockRequest = {
        body: { jobDescription: "test" },
      };

      await rewriteBulletPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Missing required fields: bulletPoint and jobDescription",
      });
    });

    it("should successfully rewrite bullet point", async () => {
      const mockResult = {
        originalBulletPoint: "Did stuff",
        rewrittenBulletPoint: "Achieved measurable results",
        improvements: ["Added metrics", "Used action verbs"],
      };

      vi.mocked(llmService.rewriteBulletPoint).mockResolvedValue(mockResult);

      mockRequest = {
        body: {
          bulletPoint: "Did stuff",
          jobDescription: "Senior Engineer role",
        },
      };

      await rewriteBulletPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should return 500 on service error", async () => {
      vi.mocked(llmService.rewriteBulletPoint).mockRejectedValue(
        new Error("Service error"),
      );

      mockRequest = {
        body: {
          bulletPoint: "test",
          jobDescription: "test",
        },
      };

      await rewriteBulletPoint(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });

  describe("generateCoverLetter", () => {
    it("should return 400 when required fields are missing", async () => {
      mockRequest = {
        body: { resumeText: "test" },
      };

      await generateCoverLetter(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error:
          "Missing required fields: resumeText, jobDescription, companyName, and jobTitle",
      });
    });

    it("should successfully generate cover letter", async () => {
      const mockResult = {
        coverLetter: "Dear Hiring Manager...",
      };

      vi.mocked(llmService.generateCoverLetter).mockResolvedValue(mockResult);

      mockRequest = {
        body: {
          resumeText: "test",
          jobDescription: "test",
          companyName: "Acme",
          jobTitle: "Engineer",
        },
      };

      await generateCoverLetter(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should handle optional keyPoints array", async () => {
      const mockResult = {
        coverLetter: "Dear Hiring Manager...",
      };

      vi.mocked(llmService.generateCoverLetter).mockResolvedValue(mockResult);

      mockRequest = {
        body: {
          resumeText: "test",
          jobDescription: "test",
          companyName: "Acme",
          jobTitle: "Engineer",
          keyPoints: ["Leadership", "Innovation"],
        },
      };

      await generateCoverLetter(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(llmService.generateCoverLetter).toHaveBeenCalledWith(
        expect.objectContaining({
          keyPoints: ["Leadership", "Innovation"],
        }),
      );
    });
  });

  describe("generateInterviewQuestions", () => {
    it("should return 400 when required fields are missing", async () => {
      mockRequest = {
        body: { jobDescription: "test" },
      };

      await generateInterviewQuestions(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Missing required fields: jobDescription and jobTitle",
      });
    });

    it("should successfully generate questions", async () => {
      const mockResult = {
        technicalQuestions: ["Q1", "Q2"],
        behavioralQuestions: ["Q3", "Q4"],
      };

      vi.mocked(llmService.generateInterviewQuestions).mockResolvedValue(
        mockResult,
      );

      mockRequest = {
        body: {
          jobDescription: "test",
          jobTitle: "Engineer",
        },
      };

      await generateInterviewQuestions(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it("should handle optional companyName", async () => {
      const mockResult = {
        technicalQuestions: ["Q1"],
        behavioralQuestions: ["Q2"],
      };

      vi.mocked(llmService.generateInterviewQuestions).mockResolvedValue(
        mockResult,
      );

      mockRequest = {
        body: {
          jobDescription: "test",
          jobTitle: "Engineer",
          companyName: "Acme",
        },
      };

      await generateInterviewQuestions(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(llmService.generateInterviewQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: "Acme",
        }),
      );
    });
  });
});
