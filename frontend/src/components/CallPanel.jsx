import { useMemo, useState } from "react";
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
  const [instructions, setInstructions] = useState("");
  const [endUserId, setEndUserId] = useState("");
  const [metadataInput, setMetadataInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [toolWebhookUrl, setToolWebhookUrl] = useState("");
  const [maxDurationSeconds, setMaxDurationSeconds] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [apiCheck, setApiCheck] = useState("");

  const parsedMetadata = useMemo(() => {
    if (!metadataInput.trim()) return undefined;
    try {
      return JSON.parse(metadataInput);
    } catch {
      return null;
    }
  }, [metadataInput]);

  const metadataError = metadataInput.trim()
    ? parsedMetadata === null
      ? "Metadata must be valid JSON."
      : Array.isArray(parsedMetadata) || typeof parsedMetadata !== "object"
        ? "Metadata must be a JSON object."
        : ""
    : "";

  const parsedTools = useMemo(() => {
    if (!toolsInput.trim()) return undefined;
    try {
      return JSON.parse(toolsInput);
    } catch {
      return null;
    }
  }, [toolsInput]);

  const toolsError = toolsInput.trim()
    ? parsedTools === null
      ? "Tools must be valid JSON."
      : !Array.isArray(parsedTools)
        ? "Tools must be a JSON array."
        : ""
    : "";

  const webhookConfig = useMemo(() => {
    const webhook = webhookUrl.trim();
    const toolWebhook = toolWebhookUrl.trim();
    if (!webhook && !toolWebhook) return undefined;
    return {
      webhook_url: webhook || undefined,
      tool_webhook_url: toolWebhook || undefined,
    };
  }, [toolWebhookUrl, webhookUrl]);

  const metadataValue =
    metadataError || parsedMetadata === undefined ? undefined : parsedMetadata;
  const toolsValue = toolsError || parsedTools === undefined ? undefined : parsedTools;

  const parsedMaxDuration = maxDurationSeconds.trim()
    ? Number(maxDurationSeconds)
    : undefined;
  const maxDurationError = maxDurationSeconds.trim()
    ? !Number.isFinite(parsedMaxDuration) || parsedMaxDuration <= 0
      ? "Max duration must be a positive number of seconds."
      : parsedMaxDuration > 3600
        ? "Max duration must be 3600 seconds or less."
        : ""
    : "";
  const maxDurationValue =
    maxDurationError || parsedMaxDuration === undefined
      ? undefined
      : Number.parseInt(maxDurationSeconds, 10);

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

  const disabled =
    !to.trim() ||
    !task.trim() ||
    Boolean(metadataError) ||
    Boolean(toolsError) ||
    Boolean(maxDurationError);

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
          <div>
            <label htmlFor="instructions">Additional instructions</label>
            <textarea
              id="instructions"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional: add extra guidance for this call."
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="end-user-id">End user ID</label>
            <input
              id="end-user-id"
              type="text"
              value={endUserId}
              onChange={(e) => setEndUserId(e.target.value)}
              placeholder="Optional tenant ID for marketplaces"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="webhook-url">Status webhook URL</label>
            <input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhooks/pamela"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="tool-webhook-url">Tool webhook URL</label>
            <input
              id="tool-webhook-url"
              type="url"
              value={toolWebhookUrl}
              onChange={(e) => setToolWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhooks/pamela-tools"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="metadata">Metadata (JSON object)</label>
            <textarea
              id="metadata"
              rows={3}
              value={metadataInput}
              onChange={(e) => setMetadataInput(e.target.value)}
              placeholder='{"customer_id":"12345"}'
              className="input-field"
            />
            {metadataError ? <p className="error">{metadataError}</p> : null}
          </div>
          <div>
            <label htmlFor="tools">Tools (JSON array)</label>
            <textarea
              id="tools"
              rows={3}
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder='[{"name":"check_order_status","description":"...","input_schema":{}}]'
              className="input-field"
            />
            {toolsError ? <p className="error">{toolsError}</p> : null}
          </div>
          <div>
            <label htmlFor="max-duration">Max duration (seconds)</label>
            <input
              id="max-duration"
              type="number"
              min="1"
              max="3600"
              inputMode="numeric"
              value={maxDurationSeconds}
              onChange={(e) => setMaxDurationSeconds(e.target.value)}
              placeholder="Optional, default 299"
              className="input-field"
            />
            {maxDurationError ? <p className="error">{maxDurationError}</p> : null}
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
          instructions={instructions.trim() || undefined}
          max_duration_seconds={maxDurationValue}
          end_user_id={endUserId.trim() || undefined}
          metadata={metadataValue}
          tools={toolsValue}
          webhooks={webhookConfig}
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
