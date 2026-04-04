# ✅ Deploy to Render - Complete Guide

## 🎯 Is Render the Right Choice?

**YES!** Render is perfect for this project because:
- ✅ Free tier available (hobby plan)
- ✅ Easy GitHub integration  
- ✅ Auto-deploys on push
- ✅ Built-in environment variables
- ✅ No credit card for free tier
- ✅ Python/Flask support out of the box
- ✅ Can handle 10+ concurrent requests

---

## 🚀 Step-by-Step Render Deployment

### **Step 1: Create Render Account** (2 min)
1. Go to **render.com**
2. Sign up with GitHub/Google
3. Verify email

### **Step 2: Create WebService on Render** (5 min)

1. Click **New +** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. Click **Connect account** if prompted
4. Select your GitHub repo
5. Configure:

```
┌─────────────────────────────────────────┐
│ Name:              call-analytics-api   │
│ Environment:       Python 3            │
│ Region:            Ohio (closest)      │
│ Build Command:     pip install -r requirements.txt
│ Start Command:     python app.py       │
│ Plan:              Free ($0/month)     │
└─────────────────────────────────────────┘
```

### **Step 3: Add Environment Variables** (2 min)

In Render dashboard, go to **Environment**:

```
API_KEY = sk_track3_987654321
WHISPER_API_KEY = sk_live_your_key_here
GEMINI_API_KEY = AIzaSy_your_key_here
FLASK_ENV = production
```

**Get your API keys:**
- **OpenAI/Whisper:** openai.com/api-keys
- **Gemini:** aistudio.google.com/app/apikey

### **Step 4: Deploy!** (30 seconds)

Click **Create Web Service** → Render automatically deploys

Watch the logs:
```
🔨 Building...
📦 Installing dependencies...
✅ Build successful
🚀 Starting server...
✅ Service live at: https://call-analytics-api.onrender.com
```

---

## ✂️ Important: Make Changes to Run on Render

### Add `requirements.txt` dependency for production server:

**File:** `backend/requirements.txt`

Add this line if not present:
```
gunicorn==20.1.0
```

### Update Start Command

You have **two options:**

**Option 1: Simple Flask (easier for dev)**
```
python app.py
```

**Option 2: Production Server (recommended)**
```
gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

Render automatically sets `$PORT` environment variable.

---

## 🧪 Test Your Render Deployment

Once live, test with:

```bash
curl -X POST https://your-api.onrender.com/api/call-analytics \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_track3_987654321" \
  -d '{
    "audioBase64": "SUQzBAAAI1NTVUQYPp3gLnBhc2",
    "language": "Tamil",
    "audioFormat": "mp3"
  }'
```

**Expected Response:**
```json
{
  "transcript": "...",
  "summary": "...",
  "keywords": ["..."],
  "sop_score": 92,
  "status": "compliant"
}
```

---

## 📊 Render Dashboard - What to Monitor

### Logs
- Service → Logs → Watch for errors
- Check: "Route /api/call-analytics registered"

### Health Checks
- Should show **Healthy** ✓
- If **Broken**, check:
  - API_KEY environment variable set?
  - WHISPER_API_KEY valid?
  - GEMINI_API_KEY valid?

### Metrics
- CPU usage
- Memory usage
- Request count

---

## 🔗 Connect Frontend to Backend

In your **Vercel frontend**, set environment variable:

```
VITE_API_URL = https://call-analytics-api.onrender.com
```

Frontend automatically connects to this URL.

---

## ⚠️ Common Issues on Render

### Issue: "502 Bad Gateway"
**Fix:**
```
1. Check logs for error messages
2. Verify all env vars are set
3. Ensure gunicorn is sending to port $PORT
4. Check WHISPER_API_KEY is valid
```

### Issue: "503 Service Unavailable"
**Fix:**
```
1. Service might be spinning up (first request takes 30-60s)
2. Wait 30 seconds and try again
3. Check if you've exceeded free tier limits
```

### Issue: "Empty response"
**Fix:**
```
1. Audio file too large
2. GEMINI_API_KEY not set
3. API rate limit hit
```

---

## 💾 Auto-Redeploy on Git Push

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render detects the push and redeploys in ~2-3 minutes.

You can see the deployment in **Render Dashboard → Deployments**.

---

## 💰 Cost Analysis

| Plan | Cost | Features |
|------|------|----------|
| Free | $0 | Perfect for this project |
| Pro | $7/mo | More resources, no auto-spin |
| Business | $19+/mo | High traffic, support |

**Recommendation:** Start with Free tier, upgrade only if needed.

---

## 🚨 Important: Free Tier Limitations

1. **Spins down after 15 min of inactivity**
   - First request takes 30-60 seconds
   - Use cron job to keep it warm (optional)

2. **Limited concurrent requests per minute**
   - Should be fine for testing
   - Monitor usage, upgrade if needed

3. **Resource limits**
   - 512 MB RAM
   - Enough for small audio files

---

## 🎯 Your URLs After Deployment

| Service | URL Type | Example |
|---------|----------|---------|
| Backend | Render | https://call-analytics-api.onrender.com |
| Frontend | Vercel | https://my-app.vercel.app |
| API Endpoint | Render | https://call-analytics-api.onrender.com/api/call-analytics |

---

## ✅ Final Checklist

- [ ] GitHub repo created with code
- [ ] Render account created
- [ ] WebService connected to GitHub
- [ ] Environment variables set (3 API keys)
- [ ] Requirements.txt has gunicorn
- [ ] start-app.ps1 updated for production
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL set in frontend
- [ ] API tested with cURL
- [ ] Logs showing "Healthy" ✓

---

## 🎉 You're Live!

Your backend is now running on Render and accessible worldwide.

**Backend URL:** https://call-analytics-api.onrender.com
**Frontend URL:** https://your-app.vercel.app

Upload audio → Get instant transcript, keywords, SOP score! 🚀
