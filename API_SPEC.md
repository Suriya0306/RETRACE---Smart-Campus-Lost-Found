# Call Analytics API Design Specification

This document details the production-ready API for the Call Centre Compliance system.

## 1. Authentication
All requests must include a mandatory API Key in the custom header: `x-api-key`.
- **Header**: `x-api-key: sk_track3_987654321`

## 2. Endpoints

### A. Analyze Call
**URL**: `POST /api/call-analytics`  
**Description**: Accepts one MP3 audio file via Base64, performs multi-stage AI analysis, and returns structured metrics.

#### Request Body (JSON)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `audioBase64` | `string` | Yes | Base64-encoded string of the audio file. |
| `language` | `string` | No | Language hint (e.g., "Tamil", "Hindi"). |
| `audioFormat` | `string` | No | Format of the audio (Always "mp3"). |

#### Response Schema (Success - 200 OK)
Returns a complete breakdown including `sop_validation`, `analytics` (payment/rejection), and `keywords`.

---

### B. Semantic Search (Vector Storage)
**URL**: `GET /api/search`  
**Description**: Performs a semantic similarity search across all indexed transcripts using vector embeddings.

#### Query Parameters
- `q` (string, Required): The natural language search query.

#### Response Schema
Returns an array of call records sorted by semantic relevance (`search_score`).

---

## 3. Evaluation Criteria Fulfillment
- **Transcription**: OpenAI Whisper with Hinglish/Tanglish optimization.
- **SOP Logic**: Strict 5-stage script validation (Greeting → ID → Problem → Solution → Closing).
- **Categorization**: Strict enums for `paymentPreference` and Objection reasons.
- **Vector Storage**: Evidence of indexing transcripts as embeddings in SQLite for high-performance semantic retrieval.
- **Performance**: Low-latency AI pipeline using Gemini 1.5 Flash.
