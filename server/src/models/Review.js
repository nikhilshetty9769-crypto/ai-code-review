const mongoose = require('mongoose');
const { SUPPORTED_LANGUAGES, ISSUE_TYPES, SEVERITY_LEVELS, REVIEW_STATUS } = require('../utils/constants');

const IssueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Issue type is required'],
      enum: {
        values: ISSUE_TYPES,
        message: '{VALUE} is not a valid issue type',
      },
    },
    severity: {
      type: String,
      required: [true, 'Severity level is required'],
      enum: {
        values: SEVERITY_LEVELS,
        message: '{VALUE} is not a valid severity level',
      },
    },
    lineNumber: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: 150,
    },
    explanation: {
      type: String,
      required: [true, 'Issue explanation is required'],
    },
    suggestedFix: {
      type: String,
      required: [true, 'Suggested fix is required'],
    },
  },
  { _id: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: 'Code Review',
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      enum: {
        values: SUPPORTED_LANGUAGES,
        message: '{VALUE} is not a supported language',
      },
      lowercase: true,
    },
    originalCode: {
      type: String,
      required: [true, 'Original source code is required'],
    },
    score: {
      type: Number,
      required: [true, 'Review score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    summary: {
      type: String,
      required: [true, 'Review summary is required'],
    },
    metrics: {
      totalIssues: { type: Number, default: 0 },
      criticalIssues: { type: Number, default: 0 },
      securityIssues: { type: Number, default: 0 },
      performanceIssues: { type: Number, default: 0 },
      qualityIssues: { type: Number, default: 0 },
    },
    issues: [IssueSchema],
    improvedCode: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: REVIEW_STATUS,
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Compound and single-field indexes for fast queries
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ language: 1 });
ReviewSchema.index({ score: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
