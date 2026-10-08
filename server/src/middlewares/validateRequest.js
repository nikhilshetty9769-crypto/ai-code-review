const { SUPPORTED_LANGUAGES } = require('../utils/constants');

/**
 * Validates the payload for creating a code review
 */
const validateReviewPayload = (req, res, next) => {
  const { language, code } = req.body;
  const errors = [];

  if (!language || typeof language !== 'string') {
    errors.push('Language is required and must be a string');
  } else if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    errors.push(`Language '${language}' is not supported. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!code || typeof code !== 'string') {
    errors.push('Source code is required and must be a string');
  } else if (code.trim().length === 0) {
    errors.push('Source code cannot be empty');
  } else if (code.length > 50000) {
    errors.push('Source code exceeds the maximum allowed length of 50,000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateReviewPayload,
};
