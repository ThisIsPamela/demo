# Pamela Quick App

[![@thisispamela/react](https://img.shields.io/badge/%40thisispamela%2Freact-1.1.0-blue)](https://www.npmjs.com/package/@thisispamela/react)
[![@thisispamela/sdk](https://img.shields.io/badge/%40thisispamela%2Fsdk-1.1.0-blue)](https://www.npmjs.com/package/@thisispamela/sdk)
[![thisispamela](https://img.shields.io/badge/thisispamela-1.1.0-blue)](https://pypi.org/project/thisispamela/)

React-based demo for the [Pamela Enterprise Voice API](https://docs.thisispamela.com/). Paste your API key in the UI and try the official component library instantly.

> **Demo only.** This app accepts API keys directly in the browser for quick testing. Keys are kept in memory and never persisted, but they are still exposed to the browser environment. For production use, route requests through a backend and never expose keys client-side.

## Prerequisites

- Node.js 18+
- Pamela Enterprise API key (starts with `pk_live_`)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## What's Included

### Frontend (React)

| Component | Description |
|-----------|-------------|
| `CallButton` | One-click call initiation with loading states |
| `CallStatus` | Live status updates with automatic polling |
| `TranscriptViewer` | Real-time transcript display |
| `CallHistory` | Paginated call list |
| `usePamela` | Hook for direct SDK access |

**Additional features:**
- API key form (key stays in memory only)
- Built-in dev proxy to avoid CORS issues
- Advanced call options (voice, agent name, webhooks, tools, metadata)

### Backend (Python) — Optional

Reference implementation using the Python SDK.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn app:app --app-dir backend --reload --port 8000
```

Create `.env` from `.env.example` and set `PAMELA_API_KEY`.

## SDK Versions

This demo uses Pamela SDK v1.1.0 across all packages:

| Package | Version | Links |
|---------|---------|-------|
| `@thisispamela/react` | 1.1.0 | [npm](https://www.npmjs.com/package/@thisispamela/react) · [docs](https://docs.thisispamela.com/enterprise/component-library) |
| `@thisispamela/sdk` | 1.1.0 | [npm](https://www.npmjs.com/package/@thisispamela/sdk) · [docs](https://docs.thisispamela.com/javascript) |
| `thisispamela` | 1.1.0 | [PyPI](https://pypi.org/project/thisispamela/) · [docs](https://docs.thisispamela.com/python) |

## Resources

- [Enterprise API Documentation](https://docs.thisispamela.com/enterprise)
- [Component Library](https://docs.thisispamela.com/enterprise/component-library)
- [API Reference](https://docs.thisispamela.com/enterprise/api-reference)
- [Changelog](https://docs.thisispamela.com/enterprise/changelog)
