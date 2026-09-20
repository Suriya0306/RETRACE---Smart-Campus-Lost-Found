# RETRACE — Smart Campus Lost & Found

> **“Retrace. Match. Recover.”**

**RETRACE** is a complete, responsive full-stack web application built for the **Fundamentals of Web Development – Oracle Hackathon**. 

It solves a real college-campus problem by introducing **Journey-Based Lost Item Search**. Instead of relying solely on keyword search, RETRACE asks students: *"Where were you before you noticed your item missing?"* and correlates personal journey timelines with reported found items.

---

## 🌟 Key Features

1. **Journey-Based Lost Item Search & Loss Zone Analysis**
   - 3-Step Journey Builder (Hostel → Canteen → CSE Block → Library → Sports Ground)
   - Real-time Loss Zone confidence percentages (e.g. *CSE BLOCK 91% Match Confidence*)
2. **Transparent Smart Matching Engine**
   - 100-Point Scoring Algorithm (Category: 25pts, Location: 30pts, Date: 15pts, Time: 15pts, Description: 15pts)
   - No black-box AI or expensive APIs — pure web development logic
3. **Item Directory & Multi-Filtering**
   - Instant live search across lost, found, and recovered campus belongings
   - Category, location, date, and type filters
4. **Lost & Found Reporting Forms**
   - Client-side validation, error handling, image upload preview, and generated report IDs (`RET-L-2026-001`, `RET-F-2026-001`)
5. **Ownership Claim Verification Matrix**
   - Side-by-side comparison of lost vs found items with metrics breakdown
   - Ownership verification questions (unique feature description)
6. **Interactive HTML/CSS Campus Location Map**
   - Visual block-based campus quad map showing real-time active reports per building
7. **Student & Admin Dashboards**
   - Student activity reports and claim status tracking
   - Admin control panel for claim reviews, approvals, and visual recovery charts

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express REST API
- **Database**: SQLite3 (`backend/db/retrace.db`) with pre-seeded hackathon demo data
- **Fallback**: LocalStorage client API fallback for offline resilience

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)

### 1. Launch Servers

Double-click `start_all.bat` on Windows, or run PowerShell:
```powershell
.\start-app.ps1
```

Or start manually:

**Backend**:
```bash
cd backend
npm install
npm start
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### 2. Access Application
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📁 Repository Structure

```text
app/
├── backend/
│   ├── db/
│   │   └── database.js       # SQLite schema & demo data seed
│   ├── server.js             # Node.js Express REST API & Smart Matching Engine
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Header & demo persona switcher
│   │   │   ├── Footer.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   └── ClaimModal.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── FindItemsPage.tsx
│   │   │   ├── ReportLostPage.tsx
│   │   │   ├── ReportFoundPage.tsx
│   │   │   ├── RetracePage.tsx            # Flagship Journey Engine
│   │   │   ├── MatchComparisonPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   └── CampusMapPage.tsx
│   │   ├── data/
│   │   │   └── mockData.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── App.tsx
│   └── package.json
├── start_all.bat
├── start-app.ps1
├── run-local.ps1
├── walkthrough.md
└── README.md
```
