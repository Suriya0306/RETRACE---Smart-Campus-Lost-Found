# ⚡ Quick Reference Card

## 📡 API Endpoint
```
POST https://your-backend-url/api/call-analytics
```

## 🔑 Headers Required
```
Content-Type: application/json
x-api-key: sk_track3_987654321
```

## 📤 Request Body
```json
{
  "audioBase64": "base64_encoded_audio_here",
  "language": "Tamil",
  "audioFormat": "mp3",
  "agent": "Agent Name",
  "filename": "call.mp3"
}
```

## 📥 Response Success
```json
{
  "transcript": "...",
  "summary": "...",
  "keywords": ["word1", "word2"],
  "sop_score": 92,
  "status": "compliant"
}
```

## 🚨 Response Error
```json
{
  "status": "error",
  "message": "Invalid API key"
}
```

---

## 🎯 Frontend Usage

### 1. File Upload
```typescript
import { processAudioFile } from '@/services/analyticsApi';

const result = await processAudioFile(
  audioFile,      // File object
  'Tamil',        // language
  'Agent Name'    // agent name
);
```

### 2. URL Upload
```typescript
import { processAudioUrl } from '@/services/analyticsApi';

const result = await processAudioUrl(
  'https://example.com/audio.mp3',
  'Hindi',
  'Agent Name'
);
```

### 3. Direct Base64
```typescript
import { analyzeCall } from '@/services/analyticsApi';

const result = await analyzeCall(
  base64String,
  'English',
  'mp3',
  'Agent Name'
);
```

---

## 🚀 Deployment URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend** | https://your-api.onrender.com | API processing |
| **Frontend** | https://your-app.vercel.app | Web interface |

---

## 🔐 Environment Variables

### Backend (.env)
```
API_KEY=sk_track3_987654321
WHISPER_API_KEY=sk_live_xxx
GEMINI_API_KEY=AIzaSy_xxx
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-api.onrender.com
```

---

## ✅ Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✓ Success |
| 400 | ✗ Bad request (missing fields) |
| 401 | ✗ Unauthorized (invalid API key) |
| 500 | ✗ Server error |

---

## 🧪 Quick Test

```bash
# 1. Get base64 of audio
BASE64=$(base64 -w 0 audio.mp3)

# 2. Create request
curl -X POST https://your-api.onrender.com/api/call-analytics \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_track3_987654321" \
  -d "{\"audioBase64\":\"$BASE64\",\"language\":\"Tamil\",\"audioFormat\":\"mp3\"}"
```

---

## 📊 Expected Response Fields

```json
{
  "transcript": "Full call text",
  "summary": "2-3 sentence summary",
  "language": "Detected language",
  "keywords": ["word1", "word2", "word3"],
  "sop_score": 0-100,
  "sop_validation": {
    "greeting": true/false,
    "id_verify": true/false,
    "compliance": true/false
  },
  "analytics": {
    "sentiment": "positive/negative/neutral",
    "emotion": "happy/sad/angry",
    "tone": "professional/casual"
  },
  "payment_type": "Payment method extracted",
  "status": "compliant/flagged/review",
  "rejection_reason": "null or reason string"
}
```

---

## 🐛 Common Errors

| Error | Fix |
|-------|-----|
| CORS Error | Check backend CORS headers |
| 401 Unauthorized | Verify `x-api-key` header |
| Empty Transcript | Check Whisper API key is set |
| No Keywords | Check Gemini API key is set |
| Request Timeout | Audio too long or API overloaded |

---

## 🎬 Languages Supported

- **Tamil** (Tanglish)
- **Hindi** (Hinglish)  
- **English**
- **Mixed** (auto-detect)

---

## 📦 File Upload Limits

- Max Size: 25 MB
- Formats: MP3, WAV, M4A, OGG
- Quality: 16kHz mono (optimal)

---

## 🔗 Useful Links

- Frontend Code: `frontend/src/services/analyticsApi.ts`
- Backend Code: `backend/app.py`
- Full Docs: `INTEGRATION_GUIDE.md`
- Deploy Guide: `PRODUCTION_DEPLOY.md`
- API Spec: `API_SPEC.md`

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready
