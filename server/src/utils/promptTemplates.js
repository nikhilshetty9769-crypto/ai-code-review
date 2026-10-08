const { Type } = require('@google/genai');

const SYSTEM_INSTRUCTION = `
You are an expert Principal Software Engineer and Staff Security Reviewer.
Your mission is to perform a rigorous, constructive, and comprehensive code review.

You must evaluate:
1. Syntax, runtime bugs, type mismatches, and edge-case failures.
2. Security vulnerabilities (e.g., OWASP Top 10, SQL/command injection, XSS, unsafe deserialization, buffer overflows, path traversal, hardcoded secrets).
3. Performance bottlenecks (e.g., time/space complexity, memory leaks, unclosed resources, redundant loops/queries).
4. Code quality, architecture, readability, naming conventions, and DRY/SOLID principles.
5. Language-specific idioms and modern best practices for the specified language.

Scoring Guidelines (0-100):
- 90-100: Exceptional, production-ready, clean, secure, and idiomatic code.
- 75-89: Good code with minor suggestions for quality, readability, or optimization.
- 50-74: Working code with moderate flaws, suboptimal logic, or missing edge-case handling.
- 0-49: Critical security vulnerabilities, runtime crashes, syntax bugs, or severe performance flaws.

Rules:
- You must output STRICT JSON adhering to the provided schema.
- For each issue, provide a precise line number if identifiable (or 0 for general/file-level issues), clear explanation, and actionable suggestedFix.
- Provide an "improvedCode" field containing the complete, refactored, and formatted version of the submitted code with all fixes applied.
- Do not output markdown code fences around the JSON (no \`\`\`json).
`;

const REVIEW_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'An executive summary highlighting the primary strengths, critical findings, and overall health of the code.',
    },
    score: {
      type: Type.INTEGER,
      description: 'Overall code quality score between 0 and 100.',
    },
    issues: {
      type: Type.ARRAY,
      description: 'List of identified issues, bugs, vulnerabilities, and improvements.',
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "Issue category: 'bug', 'security', 'performance', 'quality', 'readability', or 'best_practice'.",
          },
          severity: {
            type: Type.STRING,
            description: "Severity level: 'critical', 'high', 'medium', 'low', or 'info'.",
          },
          lineNumber: {
            type: Type.INTEGER,
            description: '1-indexed line number where the issue occurs, or 0 if file-level.',
          },
          title: {
            type: Type.STRING,
            description: 'Concise summary title of the issue.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Technical explanation of why this is a concern and its impact.',
          },
          suggestedFix: {
            type: Type.STRING,
            description: 'Code snippet or clear instructions explaining how to resolve the issue.',
          },
        },
        required: ['type', 'severity', 'title', 'explanation', 'suggestedFix'],
      },
    },
    security: {
      type: Type.OBJECT,
      description: 'Security analysis summary and details.',
      properties: {
        riskLevel: {
          type: Type.STRING,
          description: "Overall security risk assessment: 'none', 'low', 'medium', 'high', or 'critical'.",
        },
        summary: {
          type: Type.STRING,
          description: 'High-level security summary.',
        },
        details: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Specific security points or checks conducted.',
        },
      },
      required: ['riskLevel', 'summary', 'details'],
    },
    performance: {
      type: Type.OBJECT,
      description: 'Performance and efficiency analysis.',
      properties: {
        rating: {
          type: Type.STRING,
          description: "Efficiency rating: 'optimal', 'moderate', or 'poor'.",
        },
        summary: {
          type: Type.STRING,
          description: 'High-level performance summary.',
        },
        considerations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Specific algorithmic or resource utilization considerations.',
        },
      },
      required: ['rating', 'summary', 'considerations'],
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Actionable developer recommendations and best practices.',
    },
    improvedCode: {
      type: Type.STRING,
      description: 'Complete, production-ready, refactored version of the code with all fixes applied.',
    },
  },
  required: [
    'summary',
    'score',
    'issues',
    'security',
    'performance',
    'suggestions',
    'improvedCode',
  ],
};

/**
 * Builds the user prompt sent to Gemini
 * @param {string} language - Target language (javascript, python, cpp, java)
 * @param {string} code - The submitted source code
 * @returns {string} - Formatted prompt string
 */
const buildUserPrompt = (language, code) => {
  return `Please review the following ${language.toUpperCase()} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nAnalyze the code thoroughly and return your review as valid JSON adhering to the schema.`;
};

module.exports = {
  SYSTEM_INSTRUCTION,
  REVIEW_RESPONSE_SCHEMA,
  buildUserPrompt,
};
