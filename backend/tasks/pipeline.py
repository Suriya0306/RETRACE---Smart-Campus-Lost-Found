"""
Celery pipeline task: transcribe → analyse → persist to SQLite.
"""
import uuid
from datetime import datetime
try:
    from celery_app import celery  # type: ignore
    has_celery_app = True
except ImportError:
    has_celery_app = False
    class MockCelery:
        def task(self, *args, **kwargs):
            return lambda f: f
    celery = MockCelery()

from tasks.transcribe import transcribe_audio  # type: ignore
from tasks.analyse import analyse_transcript  # type: ignore
from typing import Dict, Any
from models import insert_call, init_db  # type: ignore
from tasks.semantic_search import index_transcript  # type: ignore

@celery.task(bind=True, name="tasks.pipeline.process_call")
def process_call(self, audio_b64: str, agent_name: str = "Agent", filename: str = "", language_hint: str = "Mixed") -> Dict[str, Any]:
    """
    Main Celery task:
      1. Transcribe audio with Whisper
      2. Analyse transcript with Gemini
      3. Persist result to SQLite
    Returns the full call record dict.
    """
    init_db()
    
    # Stage 1: Transcription
    u = uuid.uuid4().hex
    call_id = f"CALL-{datetime.now().strftime('%Y%m%d')}-{u[:6].upper()}"  # type: ignore

    if self and has_celery_app and hasattr(self, 'update_state'):
        self.update_state(state="PROGRESS", meta={"stage": "transcribing", "call_id": call_id})
    transcription = transcribe_audio(audio_b64, language_hint)

    # Stage 2: AI Analysis
    if self and has_celery_app and hasattr(self, 'update_state'):
        self.update_state(state="PROGRESS", meta={"stage": "analysing", "call_id": call_id})
    analysis = analyse_transcript(transcription["transcript"], transcription["language"])

    # Format duration
    dur_sec = transcription["duration_sec"]
    duration_str = f"{dur_sec // 60}:{dur_sec % 60:02d}"

    # Stage 3: Prepare DB Record (Flat for SQLite)
    # We map from the analytics/sop_validation nested dicts to existing DB columns
    record = {
        "id": call_id,
        "agent": agent_name,
        "customer": f"Customer #{u[0:6].upper()}",  # type: ignore
        "language": transcription["language"],
        "duration": duration_str,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": analysis["sop_validation"]["adherenceStatus"].lower(),
        "sop_score": int(round(float(analysis["sop_validation"]["complianceScore"]), 2) * 100),  # type: ignore
        "greeting": int(analysis["sop_validation"]["greeting"]),
        "id_verify": int(analysis["sop_validation"]["identification"]),
        "compliance": int(analysis["sop_validation"]["solutionOffering"]),  # Mapping new stage to old col for now
        "transcript": transcription["transcript"],
        "summary": analysis["summary"],
        "payment_type": analysis["analytics"]["paymentPreference"],
        "rejection_reason": analysis["analytics"]["rejectionReason"],
    }
    insert_call(record)
    
    # Semantic Search Indexing (Vector Storage)
    index_transcript(call_id, transcription["transcript"])

    # Return exactly what the user requested for the API
    return {
        "status": "success",
        "language": transcription["language"],
        "transcript": transcription["transcript"],
        "summary": analysis["summary"],
        "sop_validation": analysis["sop_validation"],
        "analytics": analysis["analytics"],
        "keywords": analysis["keywords"]
    }
