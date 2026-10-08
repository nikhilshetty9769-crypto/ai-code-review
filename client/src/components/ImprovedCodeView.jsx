import React, { useState } from 'react';
import { Copy, Check, ArrowLeftRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ImprovedCodeView({ improvedCode, onApplyToEditor }) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleCopy = async () => {
    if (!improvedCode) return;
    try {
      await navigator.clipboard.writeText(improvedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleApply = () => {
    if (onApplyToEditor && improvedCode) {
      onApplyToEditor(improvedCode);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  if (!improvedCode || !improvedCode.trim()) {
    return (
      <div className="empty-improved-view">
        <p>No refactored code provided for this snippet.</p>
      </div>
    );
  }

  const lines = improvedCode.split('\n');

  return (
    <div className="improved-code-container">
      <div className="improved-code-toolbar">
        <div className="toolbar-title">
          <Sparkles size={15} className="text-accent" />
          <span>AI Refactored Version</span>
        </div>

        <div className="toolbar-actions">
          {onApplyToEditor && (
            <button
              type="button"
              className="btn-toolbar-action btn-apply"
              onClick={handleApply}
              title="Replace editor code with this improved version"
            >
              {applied ? (
                <>
                  <CheckCircle2 size={13} className="text-success" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight size={13} />
                  <span>Apply to Editor</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            className="btn-toolbar-action"
            onClick={handleCopy}
            title="Copy improved code to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} className="text-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="improved-code-view">
        <pre className="code-display">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="code-line">
                <span className="code-line-number">{idx + 1}</span>
                <span className="code-line-text">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
