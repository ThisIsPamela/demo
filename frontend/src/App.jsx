import { useMemo, useState } from "react";
import { PamelaProvider } from "@thisispamela/react";
import { ApiKeyForm } from "./components/ApiKeyForm.jsx";
import { CallPanel } from "./components/CallPanel.jsx";
import { StatusPanel } from "./components/StatusPanel.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";

const DEFAULT_BASE_URL = "https://api.thisispamela.com";
const DEV_PROXY_BASE_URL = "/pamela";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [activeCallId, setActiveCallId] = useState(null);
  const [callData, setCallData] = useState(null);

  const providerConfig = useMemo(
    () => ({
      apiKey,
      baseUrl: import.meta.env.DEV ? DEV_PROXY_BASE_URL : DEFAULT_BASE_URL,
    }),
    [apiKey]
  );

  const handleSaveKey = ({ key }) => {
    const trimmedKey = key.trim();
    setApiKey(trimmedKey);
  };

  const handleClearKey = () => {
    setApiKey("");
  };

  return (
    <div className="app-shell app-gradient">
      <header className="app-header">
        <div className="header-brand">
          <img src="/logo.png" alt="Pamela" className="logo" />
          <div>
            <h1>Voice API Playground</h1>
            <p className="subtle">Try the Pamela Enterprise API</p>
          </div>
        </div>
        <div className="header-actions">
          <ApiKeyForm
            apiKey={apiKey}
            onSave={handleSaveKey}
            onClear={handleClearKey}
          />
          <div className={`badge-pill ${apiKey ? "ready" : "needs-key"}`}>
            {apiKey ? "Ready" : "No key"}
          </div>
        </div>
      </header>

      <div className="demo-notice">
        Demo only — keys stay in memory and are never stored.
      </div>

      <PamelaProvider config={providerConfig}>
        <main className="grid">
          <CallPanel
            onCallStart={(callId) => {
              setActiveCallId(callId);
            }}
            onCallComplete={(call) => {
              setActiveCallId(call?.id || null);
              setCallData(call);
            }}
          />
          <StatusPanel
            callId={activeCallId}
            onStatusChange={(status) => {
              setCallData(status);
            }}
            callData={callData}
          />
          <HistoryPanel onSelect={setActiveCallId} />
        </main>
      </PamelaProvider>
    </div>
  );
}
