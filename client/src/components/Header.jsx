import React from 'react';
import { Terminal, Sparkles, History } from 'lucide-react';

export default function Header({ backendStatus, onNavigateHistory }) {
  const isHealthy = backendStatus === 'healthy';
  const isChecking = backendStatus === 'checking';

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon-wrap">
            <Terminal className="logo-icon" size={22} />
          </div>
          <div className="logo-text">
            <div className="title-row">
              <h1 className="header-title">AI Code Review</h1>
              <span className="version-tag">v1.0</span>
            </div>
            <p className="header-subtitle">
              Intelligent code analysis, security auditing, and automated refactoring
            </p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="status-badges">
          <div className={`status-pill ${isHealthy ? 'status-online' : isChecking ? 'status-checking' : 'status-offline'}`}>
            <span className="status-dot"></span>
            <span className="status-label">
              {isChecking ? 'Checking API...' : isHealthy ? 'Backend Connected' : 'Backend Offline'}
            </span>
          </div>

          <div className="model-badge">
            <Sparkles size={14} className="model-sparkle" />
            <span>Gemini AI</span>
          </div>
        </div>

        {onNavigateHistory && (
          <button
            type="button"
            className="header-history-btn"
            onClick={onNavigateHistory}
            title="View review history"
          >
            <History size={16} />
            <span>History</span>
          </button>
        )}
      </div>
    </header>
  );
}
