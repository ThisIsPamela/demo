import { useState } from "react";

export function ApiKeyForm({ apiKey, onSave, onClear }) {
  const [draft, setDraft] = useState("");
  const [showKey, setShowKey] = useState(false);

  // When there's a saved key, show it; otherwise use the draft input
  const displayValue = apiKey || draft;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSave({ key: trimmed });
    setDraft("");
  };

  return (
    <form className="api-key-form" onSubmit={handleSubmit}>
      <div className="api-key-input-wrapper">
        <input
          id="api-key"
          type={showKey ? "text" : "password"}
          value={displayValue}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="pk_live_..."
          autoComplete="off"
          className="input-field api-key-input"
          readOnly={Boolean(apiKey)}
        />
        <button
          className="icon-button"
          type="button"
          onClick={() => setShowKey((prev) => !prev)}
          aria-label={showKey ? "Hide API key" : "Show API key"}
        >
          {showKey ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>
      {apiKey ? (
        <button className="btn-secondary btn-sm" type="button" onClick={onClear}>
          Clear
        </button>
      ) : (
        <button className="btn-primary btn-sm" type="submit" disabled={!draft.trim()}>
          Use key
        </button>
      )}
    </form>
  );
}
