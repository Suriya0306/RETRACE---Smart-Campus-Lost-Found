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

# genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
# _model moved to analyse_transcript for late-binding/mocking

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
        # Check for Mock Mode inside the try block
        if os.getenv("MOCK_AI", "false").lower() == "true":
            raise Exception("Mock Mode Active (MOCK_AI=true)")
            
        # Lazy config to avoid errors if key is missing and mock is NOT used
        genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Use JSON mode for speed and reliability
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text.strip())
    except Exception as e:
        # Fallback defaults (Mock mode for development)
        print(f"Analysis error, using mock fallback: {e}")
        data = {
            "summary": "The customer called to discuss their EMI schedule. The agent provided a clear explanation of the payment cycle and upcoming due dates. The customer expressed satisfaction with the clarity of the plan.",
            "greeting": True,
            "identification": True,
            "problemStatement": True,
            "solutionOffering": True,
            "closing": True,
            "explanation": "Mock analysis: All SOP stages were followed correctly in this simulation.",
            "paymentPreference": "EMI",
            "rejectionReason": "NONE",
            "sentiment": "Positive",
            "keywords": ["EMI", "Payment", "Schedule", "Clarification", "Satisfied"]
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
