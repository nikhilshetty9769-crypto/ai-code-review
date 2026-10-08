import React, { useState } from 'react';
import ScoreCard from './ScoreCard';
import MetricsSummary from './MetricsSummary';
import IssueList from './IssueList';
import ImprovedCodeView from './ImprovedCodeView';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import {
  ListChecks,
  Sparkles,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function ReviewPanel({
  reviewResult,
  loading,
  error,
  onRetry,
  onSelectSample,
  onApplyToEditor,
}) {
  const [activeTab, setActiveTab] = useState('issues');
  const [activeMetricFilter, setActiveMetricFilter] = useState('all');

  // Condition 1: Loading
  if (loading) {
    return <LoadingState />;
  }

  // Condition 2: Error
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Condition 3: Empty State (before first review)
  if (!reviewResult) {
    return <EmptyState onSelectSample={onSelectSample} />;
  }

  // Condition 4: Review Results
  const {
    summary = 'Analysis complete.',
    score = 75,
    metrics = {},
    issues = [],
    security = null,
    performance = null,
    suggestions = [],
    improvedCode = '',
    language = 'javascript',
  } = reviewResult;

  const handleMetricFilterSelect = (filterId) => {
    setActiveTab('issues');
    setActiveMetricFilter(filterId);
  };

  return (
    <div className="review-panel-container">
      {/* Top Overview Section */}
      <div className="review-overview-card">
        <div className="overview-header-row">
          <ScoreCard score={score} />

          <div className="overview-summary-box">
            <div className="summary-title-row">
              <span className="summary-badge">Summary</span>
              <span className="lang-pill">{language.toUpperCase()}</span>
            </div>
            <p className="summary-text">{summary}</p>
          </div>
        </div>

        {/* 5-Item Metrics Summary Bar */}
        <MetricsSummary
          metrics={metrics}
          onFilterSelect={handleMetricFilterSelect}
          activeFilter={activeTab === 'issues' ? activeMetricFilter : null}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="review-tabs-bar">
        <button
          type="button"
          className={`review-tab-btn ${activeTab === 'issues' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          <ListChecks size={15} />
          <span>Issues ({issues.length})</span>
        </button>

        {improvedCode && (
          <button
            type="button"
            className={`review-tab-btn ${activeTab === 'improved' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('improved')}
          >
            <Sparkles size={15} />
            <span>Improved Code</span>
            <span className="tab-pill">Ready</span>
          </button>
        )}

        {(security || performance || (suggestions && suggestions.length > 0)) && (
          <button
            type="button"
            className={`review-tab-btn ${activeTab === 'audit' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldAlert size={15} />
            <span>Audit & Suggestions</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="tab-content-area">
        {activeTab === 'issues' && (
          <IssueList
            issues={issues}
            activeFilter={activeMetricFilter}
            onFilterChange={setActiveMetricFilter}
          />
        )}

        {activeTab === 'improved' && (
          <ImprovedCodeView
            improvedCode={improvedCode}
            onApplyToEditor={onApplyToEditor}
          />
        )}

        {activeTab === 'audit' && (
          <div className="audit-details-view">
            {/* Security Section */}
            {security && (
              <div className="audit-section-card">
                <div className="audit-section-header">
                  <ShieldAlert size={18} className="text-red" />
                  <h4>Security Assessment</h4>
                  <span className={`risk-pill risk-${(security.riskLevel || 'low').toLowerCase()}`}>
                    Risk: {security.riskLevel?.toUpperCase() || 'LOW'}
                  </span>
                </div>
                <p className="audit-summary">{security.summary}</p>
                {Array.isArray(security.details) && security.details.length > 0 && (
                  <ul className="audit-checklist">
                    {security.details.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Performance Section */}
            {performance && (
              <div className="audit-section-card">
                <div className="audit-section-header">
                  <Zap size={18} className="text-yellow" />
                  <h4>Performance Evaluation</h4>
                  <span className="rating-pill">
                    Rating: {performance.rating?.toUpperCase() || 'OPTIMAL'}
                  </span>
                </div>
                <p className="audit-summary">{performance.summary}</p>
                {Array.isArray(performance.considerations) && performance.considerations.length > 0 && (
                  <ul className="audit-checklist">
                    {performance.considerations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Actionable Suggestions */}
            {Array.isArray(suggestions) && suggestions.length > 0 && (
              <div className="audit-section-card">
                <div className="audit-section-header">
                  <Sparkles size={18} className="text-accent" />
                  <h4>Key Recommendations</h4>
                </div>
                <ul className="suggestions-list">
                  {suggestions.map((s, idx) => (
                    <li key={idx} className="suggestion-item">
                      <CheckCircle2 size={15} className="text-accent" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
