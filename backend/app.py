from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .pamela_client import PamelaService

app = FastAPI(title="Pamela Quick API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = PamelaService()
call_history: dict[str, dict[str, Any]] = {}


class CallCreate(BaseModel):
    to: str = Field(..., min_length=1)
    task: str = Field(..., min_length=1)
    locale: str = Field(default="en-US", min_length=2)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/calls")
def create_call(payload: CallCreate) -> dict[str, Any]:
    try:
        response = service.create_call(payload.to, payload.task, payload.locale)
    except Exception as exc:  # pragma: no cover - SDK errors
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    call_id = response.get("id") or response.get("call_id")
    stored = {
        "id": call_id,
        "to": payload.to,
        "task": payload.task,
        "locale": payload.locale,
        "status": response.get("status"),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "raw": response,
    }
    if call_id:
        call_history[call_id] = stored
    return stored


@app.get("/api/calls/{call_id}")
def get_call(call_id: str) -> dict[str, Any]:
    try:
        response = service.get_call(call_id)
    except Exception as exc:  # pragma: no cover - SDK errors
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    stored = call_history.get(call_id, {"id": call_id})
    stored.update(
        {
            "status": response.get("status", stored.get("status")),
            "raw": response,
        }
    )
    call_history[call_id] = stored
    return stored


@app.get("/api/calls")
def list_calls() -> list[dict[str, Any]]:
    return sorted(
        call_history.values(),
        key=lambda item: item.get("created_at", ""),
        reverse=True,
    )
