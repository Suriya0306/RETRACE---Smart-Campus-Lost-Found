# Frontend-Backend Integration Guide

## 🎯 Quick Start

Your UI is now properly connected to the analytics API. Here's what was fixed:

### ✅ What's Been Updated

1. **API Service Layer** (`frontend/src/services/analyticsApi.ts`)
   - Direct Base64 audio upload to `/api/call-analytics`
   - Automatic file-to-Base64 conversion
   - Proper error handling

2. **Upload Component** (`frontend/src/sections/UploadCall.tsx`)
   - Removed old polling mechanism
   - Added language selector (Tamil, Hindi, English, Mixed)
   - Direct API calls with proper progress indication
   - Better result display (transcript, keywords, summary)

3. **Backend CORS** (`backend/app.py`)
   - Now allows all origins (secured by API key)
   - Configured for production deployment

---

## 🚀 Deployment Checklist

### Step 1: Set Environment Variables

**Backend (.env file in `backend/` folder)**
```
API_KEY=sk_track3_987654321
WHISPER_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend Environment**
Frontend automatically detects:
- Development: `http://localhost:5000` (Vite dev server)
- Production: Uses relative URL or `VITE_API_URL`

### Step 2: Test Locally

```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend (optional - Flask serves it)
# Just open http://localhost:5000 in browser
```

### Step 3: Deploy Frontend to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Option B: Git Integration**
1. Push to GitHub
2. Connect to Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-render-url`

**Option C: Drag & Drop**
1. Go to vercel.com
2. Drag & drop the `frontend/dist` folder

### Step 4: Deploy Backend to Render

1. Create account at render.com
2. Create WebService from GitHub repo
3. Set environment variables (API_KEY, WHISPER_API_KEY, GEMINI_API_KEY)
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`

---

## 🔌 API Flow

### Request Format
```typescript
POST /api/call-analytics
Content-Type: application/json
x-api-key: sk_track3_987654321

{
  "audioBase64": "SUQzBAAAI1N...",
  "language": "Tamil",
  "audioFormat": "mp3",
  "agent": "Rahul Sharma",
  "filename": "call_20240404.mp3"
}
```

### Response Format
```json
{
  "transcript": "Vanakkam sir, inga call center vanakam...",
  "summary": "Customer called regarding payment issues...",
  "language": "Tamil",
  "sop_score": 85,
  "sop_validation": {
    "greeting": true,
    "id_verify": true,
    "compliance": false
  },
  "analytics": {
    "sentiment": "positive",
    "emotion": "neutral",
    "tone": "professional"
  },
  "keywords": ["payment", "issue", "resolved", "satisfaction"],
  "payment_type": "Credit Card",
  "status": "compliant"
}
```

---

## 📝 Frontend Code Usage

### Simple File Upload
```typescript
import { processAudioFile } from '@/services/analyticsApi';

const file = fileInput.files[0];
const result = await processAudioFile(
  file,
  'Tamil',                // language
  'Rahul Sharma'         // agent name
);

console.log(result.transcript);
console.log(result.keywords);
console.log(result.sop_score);
```

### URL-based Upload
```typescript
import { processAudioUrl } from '@/services/analyticsApi';

const result = await processAudioUrl(
  'https://example.com/audio.mp3',
  'Hindi',
  'Agent Name'
);
```

### Direct Base64 Upload
```typescript
import { analyzeCall, fileToBase64 } from '@/services/analyticsApi';

const base64 = await fileToBase64(file);
const result = await analyzeCall(
  base64,
  'Tamil',
  'mp3',
  'Agent Name'
);
```

---

## 🧪 Testing with cURL

```bash
# 1. Convert audio file to base64
cat audio.mp3 | base64 > audio_b64.txt

# 2. Create JSON payload
BASE64=$(cat audio_b64.txt)
cat > payload.json <<EOF
{
  "audioBase64": "$BASE64",
  "language": "Tamil",
  "audioFormat": "mp3",
  "agent": "Test Agent"
}
EOF

# 3. Send to API
curl -X POST http://localhost:5000/api/call-analytics \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_track3_987654321" \
  -d @payload.json
```

---

## ✅ Production Checklist

- [ ] API Key is secure (not in frontend code)
- [ ] CORS is configured for your domain
- [ ] Frontend deployed to public URL (Vercel/Netlify)
- [ ] Backend deployed with environment variables
- [ ] SSL/HTTPS enabled on both
- [ ] Error handling tested
- [ ] Large file uploads tested (< 25MB recommended)
- [ ] Language detection works
- [ ] Transcript, keywords, and scores display correctly
- [ ] SOP validation rules are accurate

---

## 🐛 Troubleshooting

### CORS Error
✅ **Fixed** - CORS allows all origins, secured by API key

### 401 Unauthorized
- Check API key in request header
- Verify `x-api-key` header is present

### Large File Upload Fails
- Limit to < 25MB
- Use compression before upload
- Check cloud storage limits

### Transcript is Empty
- Whisper API key might be invalid
- Audio format not supported
- Audio quality too poor

### Keywords Not Returned
- Check Gemini API key
- Verify language is supported
- Check API rate limits

---

## 📊 File Structure

```
frontend/
├── src/
│   ├── services/
│   │   └── analyticsApi.ts        # ← Main API service (NEW)
│   ├── sections/
│   │   └── UploadCall.tsx         # ← Updated component
│   ├── apiConfig.ts               # ← API base URL config
│   └── ...
├── dist/                          # ← Built output (ready for deployment)
└── ...

backend/
├── app.py                         # ← Fixed CORS
├── tasks/
│   ├── pipeline.py
│   ├── transcribe.py
│   └── semantic_search.py
└── ...
```

---

## 🚢 Next Steps

1. **Test the integration locally** (instructions above)
2. **Deploy backend** to Render with env vars
3. **Deploy frontend** to Vercel
4. **Update API URL** if needed in frontend
5. **Test production flow** with real audio
6. **Monitor logs** for errors

Good to go! 🎉
