import { vi } from "vitest";
import type Anthropic from "@anthropic-ai/sdk";

export const createMockAnthropicResponse = (jsonContent: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: JSON.stringify(jsonContent),
    },
  ],
});

export const createMockAnthropicClient = () => {
  const mockCreate = vi.fn();

  return {
    client: {
      messages: {
        create: mockCreate,
      },
    } as unknown as Anthropic,
    mockCreate,
  };
};
