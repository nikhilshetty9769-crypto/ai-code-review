import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Zap, Sparkles, CheckCircle } from 'lucide-react';

const STAGES = [
  { label: 'Parsing abstract syntax tree (AST)...', icon: Cpu },
  { label: 'Auditing security risks & injection patterns...', icon: ShieldCheck },
  { label: 'Analyzing time/space complexity bottlenecks...', icon: Zap },
  { label: 'Synthesizing idiomatic refactoring...', icon: Sparkles },
];

export default function LoadingState() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-state-panel">
      <div className="loading-card">
        {/* Animated Radar / Scanner */}
        <div className="scanner-sphere">
          <div className="scanner-ring ring-1"></div>
          <div className="scanner-ring ring-2"></div>
          <div className="scanner-ring ring-3"></div>
          <div className="scanner-core">
            <Cpu size={28} className="pulse-icon text-accent" />
          </div>
        </div>

        <h3 className="loading-title">AI Analysis in Progress</h3>
        <p className="loading-subtitle">
          Gemini is running comprehensive static analysis and generating fixes...
        </p>

        {/* Step Progression */}
        <div className="loading-steps-list">
          {STAGES.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < activeStage;
            const isCurrent = idx === activeStage;

            return (
              <div
                key={idx}
                className={`loading-step-item ${isDone ? 'step-done' : ''} ${isCurrent ? 'step-current' : ''}`}
              >
                <div className="step-icon-wrap">
                  {isDone ? (
                    <CheckCircle size={15} className="text-success" />
                  ) : (
                    <Icon size={15} className={isCurrent ? 'text-accent pulse-soft' : 'text-muted'} />
                  )}
                </div>
                <span className="step-text">{step.label}</span>
                {isCurrent && <span className="step-badge">Processing</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
