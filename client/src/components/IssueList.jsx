import React from 'react';
import IssueItem from './IssueItem';
import { Filter, CheckCircle2 } from 'lucide-react';

export default function IssueList({ issues = [], activeFilter = 'all', onFilterChange }) {
  const filteredIssues = issues.filter((issue) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') {
      const sev = (issue.severity || '').toLowerCase();
      return sev === 'critical' || sev === 'high';
    }
    if (activeFilter === 'security') {
      return (issue.type || '').toLowerCase() === 'security';
    }
    if (activeFilter === 'performance') {
      return (issue.type || '').toLowerCase() === 'performance';
    }
    if (activeFilter === 'quality') {
      const t = (issue.type || '').toLowerCase();
      return t === 'quality' || t === 'readability' || t === 'best_practice' || t === 'bug';
    }
    return true;
  });

  if (!issues || issues.length === 0) {
    return (
      <div className="empty-issues-card">
        <CheckCircle2 size={36} className="text-success pulse-soft" />
        <h4>Clean Code — No Issues Found</h4>
        <p>The AI reviewer did not detect any security vulnerabilities or critical defects in this snippet.</p>
      </div>
    );
  }

  return (
    <div className="issues-container">
      <div className="issues-filter-bar">
        <div className="filter-title">
          <Filter size={14} />
          <span>Issues ({filteredIssues.length} of {issues.length})</span>
        </div>

        <div className="filter-chips">
          {[
            { id: 'all', label: 'All' },
            { id: 'critical', label: 'Critical/High' },
            { id: 'security', label: 'Security' },
            { id: 'performance', label: 'Performance' },
            { id: 'quality', label: 'Quality' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`filter-chip ${activeFilter === chip.id ? 'chip-active' : ''}`}
              onClick={() => onFilterChange && onFilterChange(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="issues-cards-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue, idx) => (
            <IssueItem key={`${issue.lineNumber || 'f'}-${idx}`} issue={issue} index={idx} />
          ))
        ) : (
          <div className="no-filter-match">
            <p>No issues matching filter "<strong>{activeFilter}</strong>".</p>
            <button
              type="button"
              className="btn-text-action"
              onClick={() => onFilterChange && onFilterChange('all')}
            >
              View all issues
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
