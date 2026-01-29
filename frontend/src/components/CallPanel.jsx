import { useState } from "react";
import { CallButton, usePamela } from "@thisispamela/react";

const DEFAULT_COUNTRY = "US";
const DEFAULT_LOCALE = "en-US";
const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
];
const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-CA", label: "English (Canada)" },
];
const VOICE_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

export function CallPanel({ onCallStart, onCallComplete }) {
  const { client } = usePamela();
  const [to, setTo] = useState("");
  const [task, setTask] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [agentName, setAgentName] = useState("");
  const [callerName, setCallerName] = useState("");
  const [voice, setVoice] = useState("auto");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [apiCheck, setApiCheck] = useState("");

  const handleApiCheck = async () => {
    setApiCheck("Checking API key...");
    try {
      const response = await client.listCalls({ limit: 1 });
      const total = response?.total ?? response?.items?.length ?? 0;
      setApiCheck(`API key is valid. ${total} call(s) found.`);
    } catch (error) {
      setApiCheck(`API check failed: ${error?.message || "Unknown error"}`);
    }
  };

  const disabled = !to.trim() || !task.trim();

  return (
    <section className="panel">
      <h2>Create a Call</h2>

      <label htmlFor="phone">Phone number (E.164)</label>
      <input
        id="phone"
        type="tel"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="+15551234567"
        className="input-field"
      />

      <label htmlFor="task">Task</label>
      <textarea
        id="task"
        rows={3}
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Describe what Pamela should do on the call."
        className="input-field"
      />

      <div className="advanced-toggle">
        <button
          type="button"
          className="advanced-toggle-btn"
          onClick={() => setAdvancedOpen((o) => !o)}
          aria-expanded={advancedOpen}
        >
          <span className="advanced-toggle-label">Advanced settings</span>
          <span className="advanced-toggle-icon" aria-hidden>{advancedOpen ? "▼" : "▶"}</span>
        </button>
      </div>
      {advancedOpen && (
        <div className="advanced-settings">
          <div className="two-col">
            <div>
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field"
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="locale">Locale</label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="input-field"
              >
                {LOCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="agent-name">Agent name</label>
            <input
              id="agent-name"
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Pamela"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="caller-name">Caller name</label>
            <input
              id="caller-name"
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="Who the agent is calling on behalf of"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="voice">Voice</label>
            <select
              id="voice"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="input-field"
            >
              {VOICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="call-actions">
        <CallButton
          to={to.trim()}
          task={task.trim()}
          country={country}
          locale={locale}
          voice={voice || undefined}
          agent_name={agentName.trim() || undefined}
          caller_name={callerName.trim() || undefined}
          onCallStart={(callId) => {
            setStatusMessage(`Call started: ${callId}`);
            onCallStart?.(callId);
          }}
          onCallComplete={(call) => {
            setStatusMessage(`Call ${call?.status ?? "done"}.`);
            onCallComplete?.(call);
          }}
          onError={(error) => {
            setStatusMessage(`Call failed: ${error?.message || "Unknown error"}`);
          }}
          disabled={disabled}
          className="btn-primary"
        >
          Start call
        </CallButton>
        <button className="btn-secondary" type="button" onClick={handleApiCheck}>
          Check API key
        </button>
      </div>

      {statusMessage ? <p className="status">{statusMessage}</p> : null}
      {apiCheck ? <p className="status">{apiCheck}</p> : null}
    </section>
  );
}
