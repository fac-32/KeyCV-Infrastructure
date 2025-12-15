/// <reference types="vitest/globals" />
// import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { vi } from "vitest";
import Anthropic from "@anthropic-ai/sdk";
import { LLMService } from "./llm.service.js";

// Mock the Anthropic SDK module - use vi.hoisted to ensure mockCreate is available before mock is applied
const { mockCreate } = vi.hoisted(() => {
  return {
    mockCreate: vi.fn(),
  };
});

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn(function() {
      return {
        messages: {
          create: mockCreate,
        },
      };
    }),
  };
});

describe("LLMService", () => {
  let llmService: LLMService;

  beforeEach(() => {
    // Set up environment
    process.env.ANTHROPIC_API_KEY = "test-api-key";

    // Reset mock between tests
    mockCreate.mockReset();

    // Create service instance
    llmService = new LLMService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should throw error when API key is missing", () => {
      delete process.env.ANTHROPIC_API_KEY;
      expect(() => new LLMService()).toThrow(
        "ANTHROPIC_API_KEY is not set in environment variables",
      );
    });

    it("should initialize Anthropic client with API key", () => {
      new LLMService();
      expect(Anthropic).toHaveBeenCalledWith({ apiKey: "test-api-key" });
    });
  });

  describe("analyzeResume", () => {
    it("should analyze resume and return match score", async () => {
      // Arrange
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              matchScore: 85,
              presentKeywords: ["JavaScript", "React"],
              missingKeywords: ["TypeScript", "Node.js"],
              recommendations: ["Add TypeScript experience"],
            }),
          },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const request = {
        resumeText: "Software Engineer with React experience",
        jobDescription: "Looking for TypeScript developer",
      };

      // Act
      const result = await llmService.analyzeResume(request);

      // Assert
      expect(result.matchScore).toBe(85);
      expect(result.presentKeywords).toContain("JavaScript");
      expect(result.missingKeywords).toContain("TypeScript");
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "user" }),
          ]),
        }),
      );
    });

    it("should handle JSON wrapped in markdown code blocks", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: '```json\n{"matchScore": 90, "presentKeywords": [], "missingKeywords": [], "recommendations": []}\n```',
          },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await llmService.analyzeResume({
        resumeText: "test",
        jobDescription: "test",
      });

      expect(result.matchScore).toBe(90);
    });

    it("should throw error on malformed JSON response", async () => {
      const mockResponse = {
        content: [{ type: "text", text: "invalid json {" }],
      };
      mockCreate.mockResolvedValue(mockResponse);

      await expect(
        llmService.analyzeResume({
          resumeText: "test",
          jobDescription: "test",
        }),
      ).rejects.toThrow("Failed to parse JSON response");
    });

    it("should throw error on unexpected response type", async () => {
      const mockResponse = {
        content: [{ type: "image", source: {} }],
      };
      mockCreate.mockResolvedValue(mockResponse);

      await expect(
        llmService.analyzeResume({
          resumeText: "test",
          jobDescription: "test",
        }),
      ).rejects.toThrow("Unexpected response type from Claude API");
    });
  });

  describe("rewriteBulletPoint", () => {
    it("should return rewritten bullet point with improvements", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              originalBulletPoint: "Did stuff",
              rewrittenBulletPoint: "Achieved measurable results",
              improvements: ["Added metrics", "Used action verbs"],
            }),
          },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await llmService.rewriteBulletPoint({
        bulletPoint: "Did stuff",
        jobDescription: "Senior Engineer role",
      });

      expect(result.originalBulletPoint).toBe("Did stuff");
      expect(result.rewrittenBulletPoint).toBe("Achieved measurable results");
      expect(result.improvements).toHaveLength(2);
    });
  });

  describe("generateCoverLetter", () => {
    it("should include keyPoints in prompt when provided", async () => {
      const mockResponse = {
        content: [
          { type: "text", text: '{"coverLetter": "Dear Hiring Manager..."}' },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      await llmService.generateCoverLetter({
        resumeText: "test",
        jobDescription: "test",
        companyName: "Acme",
        jobTitle: "Engineer",
        keyPoints: ["Leadership", "Innovation"],
      });

      const promptArg = mockCreate.mock.calls[0]?.[0]?.messages[0]?.content;
      expect(promptArg).toContain("Leadership");
      expect(promptArg).toContain("Innovation");
    });

    it("should work without keyPoints", async () => {
      const mockResponse = {
        content: [
          { type: "text", text: '{"coverLetter": "Dear Hiring Manager..."}' },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await llmService.generateCoverLetter({
        resumeText: "test",
        jobDescription: "test",
        companyName: "Acme",
        jobTitle: "Engineer",
      });

      expect(result.coverLetter).toBe("Dear Hiring Manager...");
    });
  });

  describe("generateInterviewQuestions", () => {
    it("should include companyName when provided", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              technicalQuestions: ["Q1", "Q2"],
              behavioralQuestions: ["Q3", "Q4"],
            }),
          },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      await llmService.generateInterviewQuestions({
        jobDescription: "test",
        jobTitle: "Engineer",
        companyName: "Acme",
      });

      const promptArg = mockCreate.mock.calls[0]?.[0]?.messages[0]?.content;
      expect(promptArg).toContain("Acme");
    });

    it("should work without companyName", async () => {
      const mockResponse = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              technicalQuestions: ["Q1"],
              behavioralQuestions: ["Q2"],
            }),
          },
        ],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await llmService.generateInterviewQuestions({
        jobDescription: "test",
        jobTitle: "Engineer",
      });

      expect(result.technicalQuestions).toHaveLength(1);
      expect(result.behavioralQuestions).toHaveLength(1);
    });
  });
});
