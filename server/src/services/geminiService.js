const { GoogleGenAI } = require('@google/genai');
const {
  SYSTEM_INSTRUCTION,
  REVIEW_RESPONSE_SCHEMA,
  buildUserPrompt,
} = require('../utils/promptTemplates');

/**
 * Normalizes and validates the AI response object
 * @param {Object} rawData - Parsed JSON from Gemini
 * @param {string} language - Target language
 * @returns {Object} - Fully formatted review object
 */
const normalizeReviewData = (rawData, language) => {
  const summary = typeof rawData.summary === 'string' ? rawData.summary.trim() : 'Code analysis complete.';
  const score = typeof rawData.score === 'number'
    ? Math.max(0, Math.min(100, Math.round(rawData.score)))
    : 70;

  const rawIssues = Array.isArray(rawData.issues) ? rawData.issues : [];
  const issues = rawIssues.map((issue) => ({
    type: issue.type || 'quality',
    severity: issue.severity || 'medium',
    lineNumber: typeof issue.lineNumber === 'number' ? issue.lineNumber : 0,
    title: issue.title || 'Code Improvement Notice',
    explanation: issue.explanation || 'No detailed explanation provided.',
    suggestedFix: issue.suggestedFix || 'Refactor as shown in improvedCode.',
  }));

  const security = rawData.security && typeof rawData.security === 'object'
    ? {
        riskLevel: rawData.security.riskLevel || 'low',
        summary: rawData.security.summary || 'Security review completed.',
        details: Array.isArray(rawData.security.details) ? rawData.security.details : [],
      }
    : { riskLevel: 'low', summary: 'No critical security risks identified.', details: [] };

  const performance = rawData.performance && typeof rawData.performance === 'object'
    ? {
        rating: rawData.performance.rating || 'optimal',
        summary: rawData.performance.summary || 'Performance evaluation completed.',
        considerations: Array.isArray(rawData.performance.considerations) ? rawData.performance.considerations : [],
      }
    : { rating: 'optimal', summary: 'Performance appears standard.', considerations: [] };

  const suggestions = Array.isArray(rawData.suggestions)
    ? rawData.suggestions.filter((s) => typeof s === 'string')
    : [];

  const improvedCode = typeof rawData.improvedCode === 'string'
    ? rawData.improvedCode
    : '';

  // Aggregate issue metrics for dashboard/overview
  const metrics = {
    totalIssues: issues.length,
    criticalIssues: issues.filter((i) => i.severity === 'critical' || i.severity === 'high').length,
    securityIssues: issues.filter((i) => i.type === 'security').length,
    performanceIssues: issues.filter((i) => i.type === 'performance').length,
    qualityIssues: issues.filter((i) => i.type === 'quality' || i.type === 'readability' || i.type === 'best_practice').length,
  };

  return {
    language,
    summary,
    score,
    metrics,
    issues,
    security,
    performance,
    suggestions,
    improvedCode,
  };
};

/**
 * Analyzes code using the Gemini Flash API
 * @param {string} language - Programming language (javascript, python, cpp, java)
 * @param {string} code - Source code to analyze
 * @returns {Promise<Object>} - Structured review response
 */
const reviewCodeWithGemini = async (language, code) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    const error = new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env');
    error.statusCode = 503;
    throw error;
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const userPrompt = buildUserPrompt(language, code);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: REVIEW_RESPONSE_SCHEMA,
      },
    });

    const responseText = response.text;

    if (!responseText || responseText.trim().length === 0) {
      const error = new Error('Empty response received from Gemini AI model.');
      error.statusCode = 502;
      throw error;
    }

    // Defensive parsing: strip accidental markdown fences if returned
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      const error = new Error(`Malformed AI JSON response: ${parseErr.message}`);
      error.statusCode = 502;
      throw error;
    }

    return normalizeReviewData(parsed, language);
  } catch (error) {
    // If it's already an error with an assigned status code, rethrow
    if (error.statusCode) {
      throw error;
    }

    // Inspect Gemini API error details
    const msg = error.message || '';
    const status = error.status || (error.response && error.response.status);

    if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID') || status === 400) {
      const err = new Error('Gemini API key is invalid. Please verify GEMINI_API_KEY in server/.env');
      err.statusCode = 401;
      throw err;
    }

    if (msg.includes('Resource has been exhausted') || msg.includes('Quota exceeded') || status === 429) {
      const err = new Error('Gemini API rate limit or quota exceeded. Please try again shortly.');
      err.statusCode = 429;
      throw err;
    }

    if (msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT') || msg.includes('FetchError')) {
      const err = new Error('Network error communicating with Gemini AI service. Please check your internet connection.');
      err.statusCode = 504;
      throw err;
    }

    const genericErr = new Error(`Gemini AI service error: ${msg}`);
    genericErr.statusCode = 500;
    throw genericErr;
  }
};

module.exports = {
  reviewCodeWithGemini,
  normalizeReviewData,
};
