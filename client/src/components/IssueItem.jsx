import React, { useState } from 'react';
import {
  AlertCircle,
  ShieldAlert,
  Zap,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function IssueItem({ issue }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const {
    type = 'quality',
    severity = 'medium',
    lineNumber = 0,
    title = 'Code Issue',
    explanation = '',
    suggestedFix = '',
  } = issue;

  const handleCopyFix = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(suggestedFix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || 'medium').toLowerCase();
    switch (s) {
      case 'critical':
        return <span className="severity-badge badge-critical">Critical</span>;
      case 'high':
        return <span className="severity-badge badge-high">High</span>;
      case 'medium':
        return <span className="severity-badge badge-medium">Medium</span>;
      case 'low':
        return <span className="severity-badge badge-low">Low</span>;
      case 'info':
      default:
        return <span className="severity-badge badge-info">Info</span>;
    }
  };

  const getTypeIcon = (t) => {
    switch ((t || '').toLowerCase()) {
      case 'security':
        return <ShieldAlert size={15} className="issue-type-icon text-red" />;
      case 'performance':
        return <Zap size={15} className="issue-type-icon text-yellow" />;
      case 'bug':
        return <AlertCircle size={15} className="issue-type-icon text-orange" />;
      default:
        return <FileCode size={15} className="issue-type-icon text-blue" />;
    }
  };

  return (
    <div className={`issue-card issue-severity-${severity.toLowerCase()}`}>
      <div className="issue-header" onClick={() => setExpanded(!expanded)}>
        <div className="issue-header-left">
          {getTypeIcon(type)}
          <span className="issue-type-label">{type.replace('_', ' ')}</span>
          {getSeverityBadge(severity)}
          {lineNumber > 0 ? (
            <span className="line-number-pill">Line {lineNumber}</span>
          ) : (
            <span className="line-number-pill pill-file">File Level</span>
          )}
        </div>

        <div className="issue-header-right">
          <button
            type="button"
            className="toggle-collapse-btn"
            aria-label="Toggle issue details"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div className="issue-title-row">
        <h4 className="issue-title">{title}</h4>
      </div>

      {expanded && (
        <div className="issue-body">
          <div className="issue-section">
            <span className="section-label">Explanation:</span>
            <p className="issue-explanation">{explanation}</p>
          </div>

          {suggestedFix && (
            <div className="issue-section fix-section">
              <div className="fix-header">
                <span className="section-label">Suggested Fix:</span>
                <button
                  type="button"
                  className="btn-copy-fix"
                  onClick={handleCopyFix}
                  title="Copy fix snippet"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Fix</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="fix-code-block">
                <code>{suggestedFix}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
