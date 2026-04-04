"""
Speech-to-Text transcription using OpenAI Whisper.
Detects and handles Hindi (Hinglish) and Tamil (Tanglish).
"""
import whisper
import tempfile
import os
import base64

from typing import Dict, Any

# Loaded once at module level to avoid reloading across calls
_model = None


def _get_model():
    global _model
    if _model is None:
        _model = whisper.load_model("tiny")
    return _model


def transcribe_audio(audio_b64: str, language_hint: str = "Mixed") -> Dict[str, Any]:
    """
    Accepts a Base64-encoded audio string (MP3/WAV).
    Returns dict: { transcript, language, duration_sec }
    """
    # Decode base64 to a temp file
    audio_bytes = base64.b64decode(audio_b64)
    suffix = ".mp3"
    
    transcript = ""
    friendly_lang = "Unknown"
    duration_sec = 0

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        model = _get_model()
        
        # Map hint to Whisper ISO codes
        whisper_lang = None
        hint_lower = language_hint.lower()
        if "tamil" in hint_lower: whisper_lang = "ta"
        elif "hindi" in hint_lower: whisper_lang = "hi"
        
        result = model.transcribe(tmp_path, task="transcribe", language=whisper_lang)
        detected_lang = result.get("language", "unknown")
        transcript = result.get("text", "").strip()

        # Map Whisper language codes
        lang_map = {"hi": "Hindi", "ta": "Tamil", "en": "English"}
        friendly_lang = lang_map.get(detected_lang, "Mixed")

        # Duration from segments
        segments = result.get("segments", [])
        duration_sec = segments[-1]["end"] if segments else 0
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

    return {
        "transcript": transcript,
        "language": friendly_lang,
        "duration_sec": round(duration_sec),
    }
