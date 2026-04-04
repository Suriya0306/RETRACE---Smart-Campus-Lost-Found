# 🚀 Complete Deployment Guide: Frontend, Backend & API

This guide covers multiple deployment options for your Call Analytics Dashboard. Choose the option that best fits your needs.

## 📋 Deployment Options Overview

| Component | Vercel + Render | Railway | DigitalOcean | AWS | Local Production |
|-----------|----------------|---------|--------------|-----|------------------|
| **Frontend** | ✅ Vercel | ✅ Railway | ✅ App Platform | ✅ S3 + CloudFront | ✅ Nginx |
| **Backend** | ✅ Render | ✅ Railway | ✅ App Platform | ✅ EC2 + Docker | ✅ Gunicorn |
| **Database** | ✅ SQLite (temp) | ✅ PostgreSQL | ✅ PostgreSQL | ✅ RDS | ✅ PostgreSQL |
| **Redis** | ✅ Render Redis | ✅ Railway Redis | ✅ Managed Redis | ✅ ElastiCache | ✅ Redis Server |
| **Cost** | Free tier | Free tier | Paid | Enterprise | Variable |
| **Setup Time** | 30 mins | 20 mins | 45 mins | 2+ hours | Variable |

---

## 🎯 **Recommended: Vercel (Frontend) + Render (Backend)**

### Prerequisites
- GitHub repository with your code
- Google Gemini API key
- GitHub account connected to Vercel/Render

### Step 1: Prepare Code for Production

1. **Add production dependencies:**
   ```bash
   # In backend/requirements.txt, add:
   gunicorn==21.2.0
   psycopg2-binary==2.9.7  # For PostgreSQL (optional)
   ```

2. **Update CORS configuration:**
   ```python
   # In backend/app.py, update CORS:
   CORS(app, origins=["https://your-app.vercel.app"])  # Replace with your Vercel domain
   ```

3. **Environment variables setup:**
   ```bash
   # Create backend/.env.production
   GEMINI_API_KEY=your_gemini_api_key_here
   REDIS_URL=redis://your-redis-url
   DATABASE_URL=postgresql://user:pass@host:5432/db  # Optional
   FLASK_ENV=production
   API_KEY=your_secure_api_key
   ```

### Step 2: Deploy Backend Infrastructure

**⚠️ Important: Render doesn't provide Redis service. Choose one of these alternatives:**

#### **Option A: Railway (Recommended - Has Everything)**
Railway provides PostgreSQL, Redis, and auto-deployment:

1. Go to [Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Railway auto-creates:
   - PostgreSQL database
   - Redis instance
   - Python backend + Celery worker
   - Node.js frontend
4. **Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_key
   FLASK_ENV=production
   API_KEY=your_secure_key
   ```
5. **Deploy** - Railway handles everything automatically!

#### **Option B: Upstash Redis (Free Redis Hosting)**
1. Go to [Upstash](https://upstash.com)
2. **Create Redis Database** (free tier: 10,000 requests/month)
3. **Copy Redis URL** (format: `redis://username:password@host:port`)

#### **Option C: Redis Cloud**
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. **Create free Redis database**
3. **Copy connection URL**

---

## 🛠️ **Detailed Render Deployment Guide**

### **Step 1: External Dependencies (Redis)**
Render's free tier does not include a managed Redis instance, which is required for your Celery workers.

**Action**: Create a free Redis instance using a provider like Upstash or Redis Cloud.

**Save the URL**: It will look like `redis://default:password@host:port`. You will need this for the environment variables below.

### **Step 2: Deploy the Flask API (Web Service)**
1. Log in to Render and click **New +** → **Web Service**
2. Connect your GitHub repository and set the **Root Directory** to `backend/`
3. Configure the Build & Start settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app -b 0.0.0.0:$PORT -w 4`
4. Add Environment Variables (under the "Env Vars" tab):
   ```
   GEMINI_API_KEY: your_actual_key
   REDIS_URL: The URL from Step 1
   API_KEY: suriya0306 (from your API_SPEC.md)
   FLASK_ENV: production
   ```

### **Step 3: Deploy the Celery Worker (Background Worker)**
Since Render's free Web Services can't run long background tasks, you must create a second service:

1. Click **New +** → **Background Worker**
2. Connect the same repository and set the **Root Directory** to `backend/`
3. Configure the Build & Start settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `celery -A celery_app.celery worker --loglevel=info`
4. **Environment Variables**: Copy the exact same variables used in Step 2

### **Step 4: Deploy Frontend (Vercel)**

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. **Add New** → **Project**
3. Import GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your Render API URL (from Step 2)
6. **Deploy**

---

## 🚂 **Railway (Recommended - All-in-One Solution)**

Railway provides everything you need in one platform - no need to manage multiple services!

1. Go to [Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Connect your repository
4. Railway auto-detects and creates:
   - **PostgreSQL database** (automatic)
   - **Redis instance** (built-in)
   - **Python backend** with Celery worker
   - **Node.js frontend**

**Environment Variables:**
```
GEMINI_API_KEY=your_gemini_api_key
API_KEY=your_secure_api_key
FLASK_ENV=production
```

**That's it!** Railway handles deployment, scaling, and monitoring automatically.

---

## 🐳 **Docker Deployment (Any Platform)**

### Create Dockerfiles

**backend/Dockerfile:**
```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json .
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 80
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
```

**docker-compose.yml** (root):
```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: call_analytics
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://user:password@db:5432/call_analytics
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis
      - db

  worker:
    build: ./backend
    command: celery -A celery_app.celery worker --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - DATABASE_URL=postgresql://user:password@db:5432/call_analytics
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:5000

volumes:
  postgres_data:
```

### Deploy Commands:
```bash
# Local development
docker-compose up --build

# Production (single server)
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☁️ **Cloud Platforms**

### **DigitalOcean App Platform**
1. **App Spec** for backend:
   ```yaml
   name: call-analytics-backend
   services:
   - name: api
     source_dir: backend
     github:
       repo: your/repo
     run_command: gunicorn app:app -b 0.0.0.0:$PORT
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
   
   databases:
   - name: redis
     engine: REDIS
     size: basic
   ```

### **AWS (ECS + Fargate)**
1. **ECS Cluster** with Fargate
2. **Services**: Frontend (S3+CloudFront), Backend (Fargate), Worker (Fargate)
3. **RDS** for PostgreSQL, **ElastiCache** for Redis

### **Google Cloud Run**
```bash
# Backend
gcloud run deploy call-analytics-api \
  --source backend/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,REDIS_URL=your_redis
```

---

## 🔧 **Environment Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `API_KEY` | API authentication key | `your-secure-key` |
| `FLASK_ENV` | Environment mode | `production` |
| `VITE_API_URL` | Frontend API endpoint | `https://api.yourdomain.com` |

---

## 🚨 **Production Considerations**

### **Security**
- Use HTTPS everywhere
- Store secrets in environment variables
- Implement proper CORS policies
- Add rate limiting
- Use secure API keys

### **Performance**
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor resource usage
- Scale workers based on load

### **Monitoring**
- Add health check endpoints
- Implement logging
- Set up error tracking
- Monitor Celery queues
- Track API usage

### **Database**
- Use PostgreSQL in production
- Implement database migrations
- Set up automated backups
- Monitor query performance

---

## 🐛 **Troubleshooting**

### **Common Issues:**
1. **Cold starts**: Free tiers sleep - implement retry logic
2. **CORS errors**: Check origin URLs in backend
3. **API timeouts**: Increase timeout values in frontend
4. **Redis connection**: Verify Redis URL format
5. **Build failures**: Check Python/Node versions

### **Debug Commands:**
```bash
# Check backend health
curl https://your-api-url/api/health

# Check Redis connection
redis-cli -u $REDIS_URL ping

# View Celery status
celery -A celery_app.celery inspect active
```

---

## 📞 **Support**

For deployment issues:
1. Check application logs in your hosting platform
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check network connectivity between services

**Need help?** Check the logs and ensure all environment variables are properly configured! 🎉
4. Expand the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://call-analytics-api.onrender.com` *(The Flask URL from Part 2, Step B)*
     > **Important**: DO NOT put a trailing slash `/` at the end of the URL!
5. Note: Since your frontend is in the `app/` folder, make sure the **Root Directory** in Vercel is set to `app/`.
6. Click **Deploy**. Vercel will build and give you a live frontend URL (e.g., `https://call-analytics-app.vercel.app`).

---

## ⚠️ Important Production Warnings

1. **SQLite Database Wipes**: Render's free tier uses "ephemeral" storage. If your backend goes to sleep (after 15 mins of inactivity on the free tier), your SQLite DB will be wiped clean. 
   - *Permanent Fix*: Later, you can create a **Render PostgreSQL database** and change your database connection string in `app.py`.
2. **Cold Starts**: On Render's Free Tier, the backend falls asleep. When you make your first request after 15 minutes, it might take 30-50 seconds to wake up! Your UI might show "Upload failed..." if it times out waiting for Render to wake up.
3. **CORS Security**: Right now we set CORS to `*`. In a real production app, after you get your Vercel URL, go back to `app.py` and restrict it:
   ```python
   CORS(app, origins=["https://your-vercel-domain.vercel.app"])
   ```
