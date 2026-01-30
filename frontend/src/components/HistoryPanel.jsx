import { CallHistory } from "@thisispamela/react";

export function HistoryPanel({ onSelect }) {
  return (
    <section className="panel history-panel">
      <h2>Call History</h2>
      <CallHistory
        limit={10}
        onCallSelect={(callId) => onSelect?.(callId)}
      />
    </section>
  );
}
