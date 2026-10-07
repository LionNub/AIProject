"""
Small AI chat playground.

The browser talks only to this app. This file decides whether to
call a real model API or return a practice reply so you can learn
the request/response shape without a paid key.
"""

from __future__ import annotations

import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import httpx

load_dotenv()

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

app = FastAPI(title="AIProject Chat Playground")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=40)
    system_prompt: str = Field(default="", max_length=4000)


class ChatResponse(BaseModel):
    reply: str
    mode: Literal["live", "practice"]
    model: str


def _api_config() -> tuple[str | None, str, str]:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    base = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    return (key or None), base, model


@app.get("/")
def index() -> FileResponse:
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


@app.get("/api/status")
def status() -> dict:
    key, base, model = _api_config()
    return {
        "mode": "live" if key else "practice",
        "model": model,
        "base_url": base if key else None,
    }


def _practice_reply(messages: list[ChatMessage], system_prompt: str) -> str:
    last_user = next((m.content for m in reversed(messages) if m.role == "user"), "")
    turns = sum(1 for m in messages if m.role == "user")
    style = system_prompt.strip() or "a clear, student-friendly tutor"
    return (
        f"[Practice mode] I am not a real model. I still follow the same "
        f"chat format: a list of roles and messages.\n\n"
        f"Turns so far: {turns}\n"
        f"Style from your system prompt: {style}\n"
        f"Your last message: {last_user}\n\n"
        f"Add OPENAI_API_KEY to a .env file to switch this route to a live API."
    )


@app.post("/api/chat", response_model=ChatResponse)
def chat(body: ChatRequest) -> ChatResponse:
    key, base, model = _api_config()

    if not key:
        return ChatResponse(
            reply=_practice_reply(body.messages, body.system_prompt),
            mode="practice",
            model="practice-echo",
        )

    payload_messages: list[dict[str, str]] = []
    if body.system_prompt.strip():
        payload_messages.append({"role": "system", "content": body.system_prompt.strip()})
    payload_messages.extend({"role": m.role, "content": m.content} for m in body.messages)

    try:
        response = httpx.post(
            f"{base}/chat/completions",
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": payload_messages,
            },
            timeout=60.0,
        )
        response.raise_for_status()
        data = response.json()
        reply = data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:500]
        raise HTTPException(status_code=502, detail=f"Model API error: {detail}") from exc
    except (KeyError, IndexError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="Unexpected model API response shape") from exc
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Could not reach model API: {exc}") from exc

    return ChatResponse(reply=reply, mode="live", model=model)
