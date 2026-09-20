# 🚀 RETRACE Multi-Platform Deployment Guide

RETRACE is configured with zero-config deployment manifests for **Render**, **Vercel**, **Netlify**, and **GitHub Pages**.

---

## 1. Vercel Deployment (Instant Frontend URL)

- **1-Click Import Link**: [https://vercel.com/new/clone?repository-url=https://github.com/Suriya0306/RETRACE---Smart-Campus-Lost-Found](https://vercel.com/new/clone?repository-url=https://github.com/Suriya0306/RETRACE---Smart-Campus-Lost-Found)
- **Configuration**: Managed automatically via `vercel.json` and `frontend/vercel.json`.
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

---

## 2. Netlify Deployment (Frontend)

- **1-Click Import Link**: [https://app.netlify.com/start](https://app.netlify.com/start)
- **Configuration**: Managed automatically via `netlify.toml`.
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

---

## 3. Render Deployment (Full-Stack Backend + Database + Frontend)

- **1-Click Blueprint Import**: [https://dashboard.render.com/select-repo?type=blueprint](https://dashboard.render.com/select-repo?type=blueprint)
- **Configuration**: Managed automatically via `render.yaml`.
- **Services Deployed**:
  - `retrace-backend`: Node.js Express REST API (`/health` & `/api/items`)
  - `retrace-frontend`: React Static Site

---

## 4. GitHub Pages

- **Live URL**: [https://suriya0306.github.io/RETRACE---Smart-Campus-Lost-Found/](https://suriya0306.github.io/RETRACE---Smart-Campus-Lost-Found/)
- **Branch**: `gh-pages`
- **Fallback**: Includes `.nojekyll` and `404.html` for single-page app routing.
