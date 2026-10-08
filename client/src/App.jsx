import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import ReviewHistory from './components/ReviewHistory';
import { submitCodeReview, checkBackendHealth } from './api/reviewService';
import { SAMPLE_CODES } from './utils/sampleCodes';
import './App.css';

export default function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SAMPLE_CODES.javascript);
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'history'

  // Check backend health on initial load
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth()
      .then((res) => {
        if (isMounted) {
          setBackendStatus(res.ok ? 'healthy' : 'offline');
        }
      })
      .catch(() => {
        if (isMounted) setBackendStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // When language changes, update sample if the editor code matches previous sample or is empty
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // If user hasn't typed custom code, switch to default sample for the new language
    const currentSample = SAMPLE_CODES[language];
    if (!code.trim() || code.trim() === currentSample?.trim()) {
      setCode(SAMPLE_CODES[newLang] || '');
    }
  };

  const handleLoadSample = (langToLoad) => {
    const targetLang = langToLoad || language;
    if (langToLoad && langToLoad !== language) {
      setLanguage(langToLoad);
    }
    setCode(SAMPLE_CODES[targetLang] || '');
  };

  const handleApplyToEditor = (improvedCode) => {
    if (improvedCode) {
      setCode(improvedCode);
    }
  };

  const handleReviewCode = async () => {
    if (!code.trim()) {
      setError(new Error('Please enter some code before requesting a review.'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await submitCodeReview(language, code);
      setReviewResult(data);
      // If review succeeds, update backend status to healthy
      setBackendStatus('healthy');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
    setReviewResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="app-shell">
      <Header backendStatus={backendStatus} onNavigateHistory={() => setCurrentView('history')} />

      <main className="workspace-main">
        {currentView === 'history' ? (
          <ReviewHistory onBack={handleBackToEditor} />
        ) : (
          <>
            {/* Left Column: Code Editor Pane */}
            <section className="workspace-column editor-column" aria-label="Code Editor">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={handleLanguageChange}
                onReview={handleReviewCode}
                onLoadSample={() => handleLoadSample(language)}
                loading={loading}
              />
            </section>

            {/* Right Column: Review Results Pane */}
            <section className="workspace-column results-column" aria-label="Review Results">
              <ReviewPanel
                reviewResult={reviewResult}
                loading={loading}
                error={error}
                onRetry={handleReviewCode}
                onSelectSample={handleLoadSample}
                onApplyToEditor={handleApplyToEditor}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

