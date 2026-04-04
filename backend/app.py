"""
Flask REST API for the Call Centre Analytics system.
"""
import os
import base64
from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from dotenv import load_dotenv  # type: ignore

has_celery = False
try:
    from celery.result import AsyncResult  # type: ignore
    from celery_app import celery  # type: ignore
    has_celery = True
except (ImportError, AttributeError):
    AsyncResult = None  # type: ignore
    celery = None  # type: ignore

from .models import init_db, get_all_calls, get_stats, get_payment_aggregates  # type: ignore

# Try to import tasks - these may fail if dependencies aren't installed
try:
    from .tasks.pipeline import process_call  # type: ignore
    from .tasks.semantic_search import search_calls  # type: ignore
except (ImportError, AttributeError) as e:
    print(f"Warning: Could not import tasks: {e}")
    # Create dummy functions that return errors
    def process_call(*args, **kwargs):  # type: ignore
        return {"status": "error", "message": "Task pipeline not available"}
    def search_calls(*args, **kwargs):  # type: ignore
        return {"status": "error", "message": "Search not available"}

has_redis = False
try:
    from redis import Redis  # type: ignore
    has_redis = True
except ImportError:
    class Redis:  # type: ignore
        @staticmethod
        def from_url(*args, **kwargs):  # type: ignore
            raise ImportError("Redis not installed")

# ── Mock/Sync Task Store ──────────────────────────
_sync_tasks = {}

load_dotenv()

# Get absolute path to frontend dist folder
import sys
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)

# For production on Render: backend only serves API, not frontend
# Frontend is on Vercel separately
app = Flask(__name__)
# Allow all origins for production deployment (secured by API key)
CORS(app, 
     allow_origins=["*"],
     allow_credentials=True,
     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "x-api-key"]
)

# ── Authentication ──────────────────────────────────
API_KEY = os.getenv("API_KEY", "suriya0306")

def require_api_key(f):  # type: ignore
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):  # type: ignore
        key = request.headers.get("x-api-key")
        if not key or key != API_KEY:
            return jsonify({"status": "error", "message": "Unauthorized. Invalid or missing API key."}), 401
        return f(*args, **kwargs)
    return decorated

# ── Rubric-Compliant Single Endpoint ────────────────
@app.route("/api/call-analytics", methods=["POST"])
@require_api_key
def analytics_sync():
    """
    Main Rubric-compliant endpoint:
    - Accepts Base64 audio + agent + language
    - Performs multi-stage analysis synchronously
    - Returns full JSON metrics immediately
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400
    
    # Support both current "audio_b64" and requested "audioBase64"
    audio_b64 = data.get("audioBase64") or data.get("audio_b64")
    if not audio_b64:
        return jsonify({"status": "error", "message": "audioBase64 or audio_b64 is required"}), 400
    
    agent_name = data.get("agent", "Agent")
    filename = data.get("filename", f"capture.{data.get('audioFormat', 'mp3')}")
    language_hint = data.get("language", "Mixed")

    try:
        # Pass language_hint for Whisper/Gemini context
        result = process_call(None, audio_b64, agent_name, filename, language_hint)
        return jsonify(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

# ── Semantic Search Endpoint ───────────────────────
@app.route("/api/search", methods=["GET"])
@require_api_key
def search():
    """
    Perform semantic search across indexed call transcripts.
    Query param: ?q=your+query
    """
    query = request.args.get("q", "")
    if not query:
        return jsonify({"status": "error", "message": "Query parameter 'q' is required"}), 400
    
    results = search_calls(query)
    return jsonify(results)

# ── Initialise DB on startup
try:
    init_db()
except Exception as e:
    import traceback
    print(f"Warning: Could not initialize database: {e}")
    traceback.print_exc()


# ─────────────────────────────────────────────
# POST /api/upload
# Accept multipart/form-data or JSON { audio_b64, agent }
# ─────────────────────────────────────────────
@app.route("/api/upload", methods=["POST"])
def upload_call():
    agent_name = "Agent"
    filename = ""

    if request.content_type and "multipart/form-data" in request.content_type:
        # File upload mode
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        audio_file = request.files["audio"]
        filename = audio_file.filename or "upload.mp3"
        agent_name = request.form.get("agent", "Agent")
        audio_bytes = audio_file.read()
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
    else:
        # JSON base64 or URL mode
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        agent_name = data.get("agent", "Agent")
            
        if "audio_url" in data:
            try:
                import urllib.request
                req = urllib.request.Request(data["audio_url"], headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=30) as resp:
                    audio_bytes = resp.read()
                
                if not audio_bytes:
                    raise Exception("Downloaded file is empty")
                audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
                filename = data["audio_url"].split("/")[-1] or "upload.mp3"
            except Exception as e:
                return jsonify({"error": f"Failed to download audio URL: {str(e)}"}), 400
        elif "audio_b64" in data:
            audio_b64 = data["audio_b64"]
            filename = data.get("filename", "upload.mp3")
        else:
            return jsonify({"error": "audio_b64 or audio_url field required"}), 400

    # Enqueue Celery task with sync fallback
    try:
        if not has_celery or not has_redis:
            raise ImportError("Celery/Redis not available")
            
        r = Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
        r.ping()
        task = process_call.delay(audio_b64, agent_name, filename)
        return jsonify({"task_id": task.id, "status": "queued"}), 202
    except Exception:
        # Fallback to sync for local demo without Redis
        task_id = f"sync-{os.urandom(4).hex()}"
        _sync_tasks[task_id] = {"status": "pending"}
        
        def run_sync():
            try:
                result = process_call(audio_b64, agent_name, filename)
                _sync_tasks[task_id] = {"status": "done", "result": result}
            except Exception as e:
                _sync_tasks[task_id] = {"status": "error", "error": str(e)}
        
        import threading
        threading.Thread(target=run_sync).start()
        return jsonify({"task_id": task_id, "status": "queued", "note": "sync-fallback"}), 202


# ─────────────────────────────────────────────
# GET /api/task/<task_id>
# Poll task status and result
# ─────────────────────────────────────────────
@app.route("/api/task/<task_id>", methods=["GET"])
def task_status(task_id):  # type: ignore
    # Check sync tasks first
    if task_id.startswith("sync-"):
        sync_task = _sync_tasks.get(task_id)
        if not sync_task:
            return jsonify({"error": "Task not found"}), 404
        if sync_task["status"] == "pending":
            return jsonify({"task_id": task_id, "status": "processing", "stage": "processing"})
        elif sync_task["status"] == "done":
            return jsonify({"task_id": task_id, "status": "done", "result": sync_task["result"]})
        else:
            return jsonify({"task_id": task_id, "status": "error", "error": sync_task.get("error")}), 500

    if not has_celery:
        return jsonify({"error": "Celery not available for background tasks"}), 503

    result = AsyncResult(task_id, app=celery)  # type: ignore
    state = result.state  # PENDING / PROGRESS / SUCCESS / FAILURE

    if state == "PENDING":
        return jsonify({"task_id": task_id, "status": "pending", "stage": "queued"})
    elif state == "PROGRESS":
        meta = result.info or {}
        return jsonify({"task_id": task_id, "status": "processing", "stage": meta.get("stage", "processing"), "call_id": meta.get("call_id", "")})
    elif state == "SUCCESS":
        return jsonify({"task_id": task_id, "status": "done", "result": result.result})
    elif state == "FAILURE":
        return jsonify({"task_id": task_id, "status": "error", "error": str(result.result)}), 500
    else:
        return jsonify({"task_id": task_id, "status": state.lower()})


# ─────────────────────────────────────────────
# GET /api/calls
# List all processed call records
# ─────────────────────────────────────────────
@app.route("/api/calls", methods=["GET"])
def list_calls():
    calls = get_all_calls()
    # Convert SQLite int booleans to Python bools for JSON
    for c in calls:
        c["greeting"] = bool(c["greeting"])
        c["id_verify"] = bool(c["id_verify"])
        c["compliance"] = bool(c["compliance"])
    return jsonify(calls)


# ─────────────────────────────────────────────
# GET /api/stats
# Aggregate dashboard stats
# ─────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
def stats():
    return jsonify(get_stats())


# ─────────────────────────────────────────────
# GET /api/payments
# Payment method aggregates
# ─────────────────────────────────────────────
@app.route("/api/payments", methods=["GET"])
def payments():
    return jsonify(get_payment_aggregates())


# ─────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend API is running"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
