import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadConfig } from '../config/loader';
import { CODE_REVIEW_PROMPT } from './prompts/code-review';

export class CodeReviewer {
  private ai: GoogleGenerativeAI;

  constructor() {
    const config = loadConfig();
    this.ai = new GoogleGenerativeAI(config.gemini.api_key);
  }

  async reviewFix(issueDescription: string, codeDiff: string) {
    const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `${CODE_REVIEW_PROMPT}
      ISSUE: ${issueDescription}
      DIFF: ${codeDiff}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text()); // Returns structured review
  }
}
