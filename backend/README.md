# Call Centre Analytics — Backend

Python/Flask + Celery backend for voice-to-text processing, SOP validation, and payment categorisation.

## Stack
- **Flask** — REST API
- **Celery + Redis** — Async task queue for voice processing
- **OpenAI Whisper** — Speech-to-text (Hindi/Tamil)
- **Google Gemini** — Summarisation, SOP validation, payment classification
- **SQLite** — Persistent call records

## Setup

### 1. Redis (required for Celery)
```bash
# With Docker:
docker run -d -p 6379:6379 redis

# Or if Redis is installed:
redis-server
```

### 2. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure environment
```bash
copy .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

### 4. Start Celery worker (new terminal)
```bash
cd backend
celery -A celery_app worker --loglevel=info
```

### 5. Start Flask API (another terminal)
```bash
cd backend
python app.py
# Runs on http://localhost:5000
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload audio (multipart or base64 JSON) |
| `GET`  | `/api/task/<id>` | Poll task status |
| `GET`  | `/api/calls` | List all call records |
| `GET`  | `/api/stats` | Aggregate dashboard stats |
| `GET`  | `/api/payments` | Payment category counts |
| `GET`  | `/api/health` | Health check |

### Upload Example (curl)
```bash
# Multipart file upload
curl -X POST http://localhost:5000/api/upload \
  -F "audio=@call.mp3" \
  -F "agent=Rahul Sharma"

# Response: {"task_id": "abc-123", "status": "queued"}
```

### Poll Example
```bash
curl http://localhost:5000/api/task/abc-123
# Stages: queued → transcribing → analysing → done
```

## Payment Categories
- **EMI** — Customer discusses instalment payment
- **Full Payment** — Customer pays full amount upfront
- **Partial Payment** — Customer pays partial amount
- **Down Payment** — Customer makes initial down payment

## SOP Checks
- ✅ Greeting — Agent greets and introduces themselves
- ✅ ID Verification — Agent verifies customer identity
- ✅ Compliance Script — Agent follows compliance guidelines
