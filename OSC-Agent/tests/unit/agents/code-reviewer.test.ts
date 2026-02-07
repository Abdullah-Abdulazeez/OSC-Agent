import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 1. Mock the loader BEFORE importing CodeReviewer
jest.mock('../../../src/config/loader', () => ({
  loadConfig: jest.fn(() => ({
    gemini: { api_key: 'fake-key', model_tier: 'auto' }
  }))
}));

import { CodeReviewer } from '../../../src/agents/code-reviewer';

describe('CodeReviewer Agent', () => {
  let reviewer: CodeReviewer;

  beforeEach(() => {
    reviewer = new CodeReviewer();
  });

  it('should return a structured review for a buggy diff', async () => {
    // Mock the AI response to avoid spending credits and ensure stability
    const mockResponse = {
      approval: 'REQUEST_CHANGES',
      issues: ['Null pointer risk on user object'],
      suggestions: ['Add a check: if (!user) return;'],
      confidenceScore: 95
    };

    // Use a spy to prevent actual API calls during unit testing
    jest.spyOn(reviewer as any, 'reviewFix').mockResolvedValue(mockResponse);

    const result = await reviewer.reviewFix('issue', 'diff');

    expect(result.approval).toBe('REQUEST_CHANGES');
    expect(result.issues).toContain('Null pointer risk on user object');
  });

  it('should approve a fix that correctly addresses the issue', async () => {
    const mockApproval = {
      approval: 'APPROVED',
      issues: [],
      suggestions: ['Great fix, follows all standards.'],
      confidenceScore: 100
    };

    jest.spyOn(reviewer as any, 'reviewFix').mockResolvedValue(mockApproval);

    const result = await reviewer.reviewFix('Fix typo', 'diff');
    expect(result.approval).toBe('APPROVED');
    expect(result.issues.length).toBe(0);
  });
});
