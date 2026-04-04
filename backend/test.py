import traceback
from tasks.pipeline import process_call
from tasks.transcribe import transcribe_audio
from tasks.analyse import analyse_transcript
import base64
import urllib.request
import os
from dotenv import load_dotenv

load_dotenv()

url = 'https://recordings.exotel.com/exotelrecordings/guvi64/5780094ea05a75c867120809da9a199f.mp3'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=30) as resp:
    audio_bytes = resp.read()

audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')

print("Transcribing...")
try:
    transcription = transcribe_audio(audio_b64, "Mixed")
    print("Transcription done!")
    text = transcription['transcript']
    print("Transcript preview:", text[:100])
    
    print("Analysing...")
    analysis = analyse_transcript(text, transcription["language"])
    
    import json
    print("Analysis results:", json.dumps(analysis, indent=2))
except Exception as e:
    print("Error occurred!")
    traceback.print_exc()
