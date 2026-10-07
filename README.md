# AIProject

A small local chat playground for learning how AI apps are wired: a browser UI, a Python API, conversation history, and an optional live model.

## Run

```powershell
cd "C:\Users\liond\Programming Projects\AIProject"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload
```

Open http://127.0.0.1:8000

Without an API key the app stays in **practice mode**. Copy `.env.example` to `.env` and set `OPENAI_API_KEY` when you want live replies.
