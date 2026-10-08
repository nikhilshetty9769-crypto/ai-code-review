import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { Play, Trash2, Copy, Check, FileCode, Keyboard } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/sampleCodes';

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  onLoadSample,
  loading = false,
}) {
  const [copied, setCopied] = useState(false);
  const [monacoFailed] = useState(false);
  const editorRef = useRef(null);

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    setCode('');
  };

  // Keyboard shortcut listener (Ctrl+Enter or Cmd+Enter)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!loading && code.trim()) {
        onReview();
      }
    }
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div className="editor-card" onKeyDown={handleKeyDown}>
      {/* Editor Top Bar */}
      <div className="editor-top-bar">
        <LanguageSelector
          selectedLanguage={language}
          onLanguageChange={setLanguage}
          onLoadSample={onLoadSample}
          disabled={loading}
        />

        <div className="editor-quick-actions">
          <button
            type="button"
            className="action-btn"
            onClick={handleCopyCode}
            disabled={!code || loading}
            title="Copy code to clipboard"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            className="action-btn"
            onClick={handleClear}
            disabled={!code || loading}
            title="Clear editor"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="editor-main-container">
        {!monacoFailed ? (
          <Editor
            height="100%"
            language={selectedLangObj.monacoLang}
            value={code}
            theme="vs-dark"
            onChange={(val) => setCode(val || '')}
            onMount={handleEditorMount}
            loading={
              <div className="monaco-loading-placeholder">
                <FileCode size={24} className="pulse-icon" />
                <span>Loading Editor...</span>
              </div>
            }
            options={{
              fontSize: 13.5,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              tabSize: 2,
              wordWrap: 'on',
              automaticLayout: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
              overviewRulerBorder: false,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        ) : (
          <textarea
            className="code-textarea-fallback"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste or write your source code here..."
            spellCheck="false"
          />
        )}
      </div>

      {/* Editor Bottom Bar */}
      <div className="editor-bottom-bar">
        <div className="editor-stats">
          <span className="stat-item">
            <span className="stat-label">Lines:</span> {lineCount}
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <span className="stat-label">Chars:</span> {charCount.toLocaleString()}
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-shortcut">
            <Keyboard size={12} />
            <span>Ctrl + Enter to run</span>
          </span>
        </div>

        <button
          type="button"
          className={`btn-review ${loading ? 'is-loading' : ''}`}
          onClick={onReview}
          disabled={loading || !code.trim()}
          id="btn-review-code"
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              <span>Reviewing Code...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Review Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
