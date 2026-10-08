import React from 'react';
import { Award, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ScoreCard({ score = 0 }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'score-high';
  let ratingLabel = 'Excellent';
  let ratingDesc = 'Production-ready code with strong practices.';
  let Icon = CheckCircle;

  if (normalizedScore < 50) {
    colorClass = 'score-critical';
    ratingLabel = 'Critical Issues';
    ratingDesc = 'Severe bugs or security flaws require immediate fixing.';
    Icon = ShieldAlert;
  } else if (normalizedScore < 75) {
    colorClass = 'score-medium';
    ratingLabel = 'Needs Improvement';
    ratingDesc = 'Moderate flaws in logic, efficiency, or error handling.';
    Icon = AlertTriangle;
  } else if (normalizedScore < 90) {
    colorClass = 'score-good';
    ratingLabel = 'Good Quality';
    ratingDesc = 'Solid code structure with minor suggestions for optimization.';
    Icon = Award;
  }

  // SVG circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`score-card ${colorClass}`}>
      <div className="score-ring-wrap">
        <svg className="score-ring-svg" width="96" height="96" viewBox="0 0 96 96">
          <circle
            className="score-ring-bg"
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="7"
          />
          <circle
            className="score-ring-fill"
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="score-number-overlay">
          <span className="score-value">{normalizedScore}</span>
          <span className="score-scale">/100</span>
        </div>
      </div>

      <div className="score-info">
        <div className="score-header-badge">
          <Icon size={16} />
          <span>{ratingLabel}</span>
        </div>
        <p className="score-description">{ratingDesc}</p>
      </div>
    </div>
  );
}
