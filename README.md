# Pamela Quick App

React-based demo for the Pamela Enterprise Voice API. Paste your API key in the
UI and try the official component library instantly.

> **Demo only.** This app accepts API keys directly in the browser for quick
> testing. Keys are kept in memory and never persisted, but they are still
> exposed to the browser environment. For production use, route requests
> through a backend and never expose keys client-side.

## Prerequisites

- Node.js 18+
- Pamela Enterprise API key (starts with `pk_live_`)
- Pamela SDKs `@thisispamela/react` + `@thisispamela/sdk` v1.0.4

## Run the demo

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## What the demo includes

- API key form (key stays in memory)
- Built-in dev proxy to avoid CORS issues when listing call history
- Call creation using `CallButton`
- Live status updates via `CallStatus`
- Transcript display using `TranscriptViewer`
- Call list using `CallHistory`
- API key validation using the `usePamela` hook

## Python backend reference (optional)

If you want a backend example using the Python SDK, see `backend/`.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn app:app --app-dir backend --reload --port 8000
```

Create `.env` from `.env.example` and set `PAMELA_API_KEY`.
