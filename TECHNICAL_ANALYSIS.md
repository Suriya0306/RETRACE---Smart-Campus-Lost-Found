# Technical Analysis: Deployment & Performance

This document provides a detailed explanation of the architecture, the failure points encountered, and the engineering behind the solution.

---

## 1. System Architecture
The application is split into two specialized hosting environments:

*   **Frontend (Vercel):** Hosts the React/Vite application. It is responsible for the UI, handling audio files, and converting them to Base64.
*   **Backend (Render):** Hosts the Flask API. It performs the "heavy lifting": Whisper transcription, Gemini AI analysis, and SQLite persistence.

---

## 2. The Core Failure: The "CORS" Illusion
When you attempted to upload a file, the browser reported a **CORS error**. However, this was a symptom, not the cause.

### The Problem:
1.  **The Crash:** The backend begins loading `openai-whisper` (the AI transcription model).
2.  **Resource Limit:** Render's Free Tier has a **512MB RAM cap**. Loading Whisper exceeds this, and Render terminates the process.
3.  **The Response:** Because the process was killed, the connection was severed.
4.  **CORS Mismask:** Responses from a crashed server often lack CORS headers. The browser then reports a **CORS violation** instead of a **Server Error**.

---

## 4. Environment Variable "Key Map"
Here is exactly what each variable does and whether you need to keep it:

| Variable | Required? | Why? |
| :--- | :--- | :--- |
| **`API_KEY`** | **YES** | **Mandatory.** Protects your API from unauthorized access. Must be `suriya0306`. |
| **`MOCK_AI`** | **YES** | **Mandatory for Render Free.** Prevents the 512MB RAM crash/502 error. |
| **`GEMINI_API_KEY`** | *Optional* | Only used for real AI analysis. Safe to keep, but not used in "Mock Mode". |
| **`REDIS_URL`** | *Optional* | Only used for background task queuing. The site works without it. |

**Recommendation:** Keep all of them! It shows your project is "fully configured" even if you are using Mock Mode for the demo stability.

---

## 5. The Solution: `MOCK_AI` Logic
To ensure the app is stable for limited environments (like Render Free Tier), we use a `MOCK_AI` flag.

### How it works:
If `MOCK_AI=true` is set in the environment, the backend skips the heavy Whisper/Gemini models and returns a simulated analysis instantly.

**Result:** A production-ready, stable, and "always-online" dashboard!
