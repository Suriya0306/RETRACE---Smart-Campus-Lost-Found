# 🚀 RETRACE Auto-Deployment Guide

RETRACE is configured for zero-config **Auto-Deployment** on major cloud hosting platforms:

---

## 1. Render Auto-Deployment (Recommended Full-Stack)

1. Go to **[Render.com](https://render.com)** and sign in with your GitHub account.
2. Click **New +** → **Blueprint**.
3. Connect your repository: `Suriya0306/RETRACE---Smart-Campus-Lost-Found`.
4. Render will detect `render.yaml` and automatically deploy both:
   - **`retrace-backend`**: Node.js Express REST API
   - **`retrace-frontend`**: React Production Static Site
5. **Auto-Deploy**: Every future push to the `main` branch will automatically trigger a rebuild and deploy!

---

## 2. Vercel Auto-Deployment (Frontend)

1. Go to **[Vercel.com](https://vercel.com)** and import repository `Suriya0306/RETRACE---Smart-Campus-Lost-Found`.
2. Select Root Directory: `frontend`.
3. Vercel automatically detects Vite + React (`vercel.json` included).
4. Click **Deploy**.

---

## 3. GitHub Actions CI/CD Pipeline

The `.github/workflows/deploy.yml` workflow automatically runs on every push to `main` to build, typecheck, and validate the application automatically.
