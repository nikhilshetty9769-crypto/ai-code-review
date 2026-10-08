import React from 'react';
import { Terminal, Shield, Zap, Sparkles, Wand2 } from 'lucide-react';

export default function EmptyState({ onSelectSample }) {
  return (
    <div className="empty-state-panel">
      <div className="empty-state-card">
        <div className="empty-icon-banner">
          <Terminal size={36} className="empty-main-icon" />
        </div>

        <h3 className="empty-title">Ready for AI Code Review</h3>
        <p className="empty-subtitle">
          Submit code from the editor on the left to receive an in-depth security, performance, and best-practice analysis.
        </p>

        <div className="feature-cards-grid">
          <div className="feature-mini-card">
            <Shield size={18} className="feat-icon text-red" />
            <div className="feat-content">
              <strong>Vulnerability Scan</strong>
              <p>Detects OWASP risks, injection attacks, and memory flaws.</p>
            </div>
          </div>

          <div className="feature-mini-card">
            <Zap size={18} className="feat-icon text-yellow" />
            <div className="feat-content">
              <strong>Performance Audit</strong>
              <p>Identifies resource leaks, algorithmic complexity, and bottlenecks.</p>
            </div>
          </div>

          <div className="feature-mini-card">
            <Sparkles size={18} className="feat-icon text-purple" />
            <div className="feat-content">
              <strong>Auto Refactoring</strong>
              <p>Generates idiomatic, production-ready code with fixes applied.</p>
            </div>
          </div>
        </div>

        <div className="quick-start-box">
          <span className="quick-start-label">Quick Test:</span>
          <div className="quick-start-buttons">
            <button
              type="button"
              className="btn-quick-sample"
              onClick={() => onSelectSample && onSelectSample('javascript')}
            >
              <Wand2 size={13} /> JavaScript
            </button>
            <button
              type="button"
              className="btn-quick-sample"
              onClick={() => onSelectSample && onSelectSample('python')}
            >
              <Wand2 size={13} /> Python
            </button>
            <button
              type="button"
              className="btn-quick-sample"
              onClick={() => onSelectSample && onSelectSample('cpp')}
            >
              <Wand2 size={13} /> C++
            </button>
            <button
              type="button"
              className="btn-quick-sample"
              onClick={() => onSelectSample && onSelectSample('rust')}
            >
              <Wand2 size={13} /> Rust
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
