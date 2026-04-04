"""
AI analysis using Google Gemini:
- Text summarisation
- SOP validation
- Payment categorisation (EMI / Full / Partial / Down Payment)
- Rejection reason extraction
"""
import os
import json
import re
import google.generativeai as genai  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
_model = genai.GenerativeModel("gemini-1.5-flash")

SOP_TEMPLATE = """
Standard Operating Procedure (SOP) Stages:
1. Greeting: Agent greets the customer and introduces themselves.
2. Identification: Agent verifies the customer's identity.
3. Problem Statement: Agent identifies the reason for the call or the customer's outstanding issue.
4. Solution Offering: Agent provides a clear path forward (payment options, EMI setup, etc.).
5. Closing: Agent formally closes the conversation.
"""

def analyse_transcript(transcript: str, language: str) -> dict:
    """
    Runs Gemini analysis on the transcript string.
    Returns a dict with: summary, sop_validation, analytics, keywords
    """
    prompt = f"""
You are an expert call centre quality analyst. Analyse the following {language} call transcript.

{SOP_TEMPLATE}

Transcript:
\"\"\"
{transcript}
\"\"\"

Respond ONLY with a valid JSON object (no markdown) with these exact keys:
{{
  "summary": "<Concise English summary>",
  "greeting": bool,
  "identification": bool,
  "problemStatement": bool,
  "solutionOffering": bool,
  "closing": bool,
  "explanation": "<Why stages were or were not followed>",
  "paymentPreference": "<STRICTLY one of: EMI, FULL_PAYMENT, PARTIAL_PAYMENT, DOWN_PAYMENT. Use PARTIAL_PAYMENT for 'pay some now, rest later' scenarios. Use NONE if no intent is found.>",
  "rejectionReason": "<If no payment, identify reason: e.g., HIGH_INTEREST, BUDGET_CONSTRAINTS, ALREADY_PAID, NOT_INTERESTED, or NONE>",
  "sentiment": "<Positive, Neutral, or Negative>",
  "keywords": ["key term 1", "key term 2", ...]
}}
"""

    try:
        # Use JSON mode for speed and reliability
        response = _model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text.strip())
    except Exception as e:
        # Fallback defaults
        data = {
            "summary": f"[Analysis unavailable: {str(e)}]",
            "greeting": False,
            "identification": False,
            "problemStatement": False,
            "solutionOffering": False,
            "closing": False,
            "explanation": "Could not extract SOP validation details.",
            "paymentPreference": "UNKNOWN",
            "rejectionReason": "",
            "sentiment": "Neutral",
            "keywords": []
        }

    # Compute SOP score decimal (0.0 to 1.0)
    checks = [
        bool(data.get("greeting", False)), 
        bool(data.get("identification", False)), 
        bool(data.get("problemStatement", False)),
        bool(data.get("solutionOffering", False)),
        bool(data.get("closing", False))
    ]
    compliance_score = round(sum(checks) / len(checks), 2)  # type: ignore
    
    # adherenceStatus
    adherence_status = "FOLLOWED" if all(checks) else "NOT_FOLLOWED"

    return {
        "summary": data.get("summary", ""),
        "sop_validation": {
            "greeting": bool(data.get("greeting", False)),
            "identification": bool(data.get("identification", False)),
            "problemStatement": bool(data.get("problemStatement", False)),
            "solutionOffering": bool(data.get("solutionOffering", False)),
            "closing": bool(data.get("closing", False)),
            "complianceScore": float(compliance_score),
            "adherenceStatus": adherence_status,
            "explanation": data.get("explanation", "")
        },
        "analytics": {
            "paymentPreference": data.get("paymentPreference", "UNKNOWN"),
            "rejectionReason": data.get("rejectionReason", ""),
            "sentiment": data.get("sentiment", "Neutral")
        },
        "keywords": data.get("keywords", [])
    }
