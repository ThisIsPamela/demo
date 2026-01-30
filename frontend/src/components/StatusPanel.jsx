import { useEffect, useState, useRef } from "react";
import { CallStatus, TranscriptViewer, usePamela } from "@thisispamela/react";

export function StatusPanel({ callId, onStatusChange, callData }) {
  const [status, setStatus] = useState(callData || null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);
  const [hangupLoading, setHangupLoading] = useState(false);
  const [hangupError, setHangupError] = useState(null);
  const refetchDone = useRef(false);
  const { client } = usePamela();

  useEffect(() => {
    setStatus(callData || null);
  }, [callData]);

  useEffect(() => {
    if (!callId) {
      setStatus(null);
      setRefreshError(null);
      refetchDone.current = false;
    }
  }, [callId]);

  const handleRefresh = async () => {
    if (!callId || !client) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      const next = await client.getCall(callId);
      setStatus(next);
      onStatusChange?.(next);
    } catch (err) {
      setRefreshError(err?.message || "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleHangup = async () => {
    if (!callId || !client) return;
    setHangupLoading(true);
    setHangupError(null);
    try {
      const statusValue = status?.status;
      const shouldCancel =
        statusValue === "queued" || statusValue === "ringing";
      const next = shouldCancel
        ? await client.cancelCall(callId)
        : await client.hangupCall(callId);
      setStatus(next);
      onStatusChange?.(next);
    } catch (err) {
      setHangupError(err?.message || "Hangup failed");
    } finally {
      setHangupLoading(false);
    }
  };

  const hangupDisabled =
    !callId ||
    !client ||
    hangupLoading ||
    status?.status === "completed" ||
    status?.status === "failed" ||
    status?.status === "cancelled";
  const hangupLabel =
    status?.status === "queued" || status?.status === "ringing"
      ? "Cancel call"
      : "Hang up";

  // When call is completed but transcript not yet available, refetch after a delay
  // (backend may attach transcript asynchronously)
  useEffect(() => {
    if (!callId || !client || refetchDone.current) return;
    const completed = status?.status === "completed";
    const noTranscript = !status?.transcript?.length;
    if (!completed || !noTranscript) return;

    const t = setTimeout(async () => {
      refetchDone.current = true;
      try {
        const next = await client.getCall(callId);
        if (next?.transcript?.length) {
          setStatus(next);
          onStatusChange?.(next);
        }
      } catch {
        // Ignore refetch errors for automatic retry
      }
    }, 3000);

    return () => clearTimeout(t);
  }, [callId, client, status?.status, status?.transcript?.length, onStatusChange]);

  if (!callId) {
    return (
      <section className="panel">
        <h2>Call Status</h2>
        <p className="subtle">Select a call to see live updates.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Call Status</h2>
        <div className="panel-actions">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "Refresh status"}
          </button>
          <button
            type="button"
            className="btn-danger btn-sm"
            onClick={handleHangup}
            disabled={hangupDisabled}
          >
            {hangupLoading ? "Hanging up…" : hangupLabel}
          </button>
        </div>
      </div>

      <CallStatus
        callId={callId}
        pollInterval={5000}
        showTranscript={false}
        onStatusChange={(nextStatus) => {
          setStatus(nextStatus);
          onStatusChange?.(nextStatus);
        }}
      />

      {status?.summary ? (
        <div className="card">
          <strong>Summary</strong>
          <p>{status.summary}</p>
        </div>
      ) : null}

      {refreshError ? (
        <p className="error">{refreshError}</p>
      ) : null}
      {hangupError ? <p className="error">{hangupError}</p> : null}

      {status?.transcript?.length ? (
        <div className="card transcript">
          <h3>Transcript</h3>
          <TranscriptViewer transcript={status.transcript} />
        </div>
      ) : status?.status === "completed" ? (
        <p className="subtle">No transcript yet. Try &quot;Refresh status&quot; again in a few seconds.</p>
      ) : null}
    </section>
  );
}
