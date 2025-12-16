import { vi } from "vitest";
import type { Request, Response } from "express";

export const createMockRequest = (
  overrides: Partial<Request> = {},
): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});

export const createMockResponse = (): {
  res: Partial<Response>;
  statusMock: ReturnType<typeof vi.fn>;
  jsonMock: ReturnType<typeof vi.fn>;
} => {
  const jsonMock = vi.fn();
  const statusMock = vi.fn().mockReturnValue({ json: jsonMock });

  const res: Partial<Response> = {
    status: statusMock,
    json: jsonMock,
    send: vi.fn(),
    sendStatus: vi.fn(),
  };

  return { res, statusMock, jsonMock };
};
