import React from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/sampleCodes';
import { Code2, Wand2 } from 'lucide-react';

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  onLoadSample,
  disabled = false,
}) {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="language-selector-wrap">
      <div className="selector-group">
        <label htmlFor="language-select" className="selector-label">
          <Code2 size={15} />
          <span>Language:</span>
        </label>
        <div className="select-container">
          <select
            id="language-select"
            className="language-select"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={disabled}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} ({lang.extension})
              </option>
            ))}
          </select>
          <span className="lang-tag">{currentLang.extension}</span>
        </div>
      </div>

      <button
        type="button"
        className="btn-sample"
        onClick={onLoadSample}
        disabled={disabled}
        title="Load example snippet with intentional bugs to review"
      >
        <Wand2 size={14} />
        <span>Load Sample</span>
      </button>
    </div>
  );
}
