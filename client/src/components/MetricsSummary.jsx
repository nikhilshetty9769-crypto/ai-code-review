import React from 'react';
import {
  ListChecks,
  AlertOctagon,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function MetricsSummary({ metrics = {}, onFilterSelect, activeFilter }) {
  const {
    totalIssues = 0,
    criticalIssues = 0,
    securityIssues = 0,
    performanceIssues = 0,
    qualityIssues = 0,
  } = metrics;

  const items = [
    {
      id: 'all',
      label: 'Total Issues',
      count: totalIssues,
      icon: ListChecks,
      variant: 'default',
    },
    {
      id: 'critical',
      label: 'Critical / High',
      count: criticalIssues,
      icon: AlertOctagon,
      variant: criticalIssues > 0 ? 'critical' : 'neutral',
    },
    {
      id: 'security',
      label: 'Security',
      count: securityIssues,
      icon: securityIssues > 0 ? ShieldAlert : ShieldCheck,
      variant: securityIssues > 0 ? 'security' : 'neutral',
    },
    {
      id: 'performance',
      label: 'Performance',
      count: performanceIssues,
      icon: Zap,
      variant: performanceIssues > 0 ? 'performance' : 'neutral',
    },
    {
      id: 'quality',
      label: 'Quality',
      count: qualityIssues,
      icon: Sparkles,
      variant: qualityIssues > 0 ? 'quality' : 'neutral',
    },
  ];

  return (
    <div className="metrics-summary-grid">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeFilter === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`metric-tile metric-${item.variant} ${isActive ? 'is-active' : ''}`}
            onClick={() => onFilterSelect && onFilterSelect(item.id)}
            title={`Filter by ${item.label}`}
          >
            <div className="metric-header">
              <Icon size={16} className="metric-icon" />
              <span className="metric-label">{item.label}</span>
            </div>
            <div className="metric-count">{item.count}</div>
          </button>
        );
      })}
    </div>
  );
}
