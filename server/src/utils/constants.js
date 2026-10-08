const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'ruby',
];

const ISSUE_TYPES = [
  'bug',
  'security',
  'performance',
  'quality',
  'readability',
  'best_practice'
];

const SEVERITY_LEVELS = [
  'critical',
  'high',
  'medium',
  'low',
  'info'
];

const REVIEW_STATUS = [
  'pending',
  'completed',
  'failed'
];

module.exports = {
  SUPPORTED_LANGUAGES,
  ISSUE_TYPES,
  SEVERITY_LEVELS,
  REVIEW_STATUS
};
