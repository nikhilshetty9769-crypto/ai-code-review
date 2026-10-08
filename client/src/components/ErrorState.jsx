import React from 'react';
import { AlertTriangle, RefreshCw, ServerOff } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  const errorMessage = error?.message || 'An unexpected error occurred during the review.';
  const isNetwork = errorMessage.toLowerCase().includes('backend') || errorMessage.toLowerCase().includes('reach');

  return (
    <div className="error-state-panel">
      <div className="error-card">
        <div className="error-icon-wrap">
          {isNetwork ? (
            <ServerOff size={32} className="text-red" />
          ) : (
            <AlertTriangle size={32} className="text-amber" />
          )}
        </div>

        <h3 className="error-title">
          {isNetwork ? 'Backend Connection Failed' : 'Review Request Failed'}
        </h3>

        <p className="error-description">{errorMessage}</p>

        {isNetwork && (
          <div className="error-troubleshooting-box">
            <span className="troubleshoot-title">Troubleshooting:</span>
            <ul>
              <li>Ensure the server is running on <code>http://localhost:5000</code></li>
              <li>Verify MongoDB Atlas and GEMINI_API_KEY in <code>server/.env</code></li>
            </ul>
          </div>
        )}

        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
