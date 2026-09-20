# RETRACE - Smart Campus Lost & Found Walkthrough & Verification Guide

Built for the **Fundamentals of Web Development – Oracle Hackathon**, **RETRACE** ("Retrace. Match. Recover.") is a full-stack, responsive web application that introduces **Journey-Based Lost Item Search** to help college students recover lost belongings.

---

## 🌟 Key Accomplishments

### 1. Flagship Journey-Based Loss Analysis Engine (`/retrace`)
- **3-Step Interactive Journey Builder**:
  1. **Step 1: Item Details** (Name, Category, Brand, Color, Description)
  2. **Step 2: Time Window** (Date lost, Time last seen, Time noticed missing)
  3. **Step 3: Campus Journey Builder** (Hostel 08:30 AM → Canteen 09:00 AM → CSE Block 09:20 AM → Library 10:30 AM → Sports Ground 12:00 PM with add/edit/delete/reorder support)
- **Potential Loss Zones Analysis**:
  - Displays match-confidence progress bars:
    - **CSE BLOCK** — 91% Match Confidence
    - **LIBRARY** — 74% Match Confidence
    - **CANTEEN** — 52% Match Confidence
    - **SPORTS GROUND** — 24% Match Confidence
- **Transparent 100-Point Smart Matching Engine**:
  - Category Match: 25 points
  - Location Match: 30 points
  - Date Match: 15 points
  - Time Match: 15 points
  - Description Match: 15 points
- **Possible Match Found Banner**:
  - Automatically correlates lost journey logs with found item reports (e.g. Black College Backpack at CSE Block with 89% Match Confidence).

### 2. Complete Hackathon Demonstration Workflow (Scenes 1 - 12)
1. **Scene 1 (Login)**: Student logs in / switches to Alex Vance persona.
2. **Scene 2 (Start Retracing)**: Clicks "Start Retracing" CTA from Hero or Navbar.
3. **Scene 3 (Item Input)**: Enters "Black Backpack" details.
4. **Scene 4 (Journey Building)**: Adds Hostel → Canteen → CSE Block → Library → Sports Ground.
5. **Scene 5 (Analyze)**: Clicks "Analyze My Journey" with scanning loader.
6. **Scene 6 (Loss Zones)**: Evaluates loss zones (CSE Block 91%, Library 74%).
7. **Scene 7 (Possible Match)**: Identifies found match "Black College Backpack" (89% match).
8. **Scene 8 (Claim Submission)**: Submits ownership verification claim answering unique feature questions (turtle keychain).
9. **Scene 9 (Admin Portal)**: Admin switches to Prof. Sarah Jenkins persona to review pending claims.
10. **Scene 10 (Approval)**: Admin approves claim.
11. **Scene 11 (Notification)**: Notification delivered to student.
12. **Scene 12 (Recovered Status)**: Item status updates to `RECOVERED ✓`.

### 3. Core Web Development Focus & Architecture
- **HTML5**: Semantic elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<form>`, `<section>`), accessible labels, ARIA controls.
- **CSS3 / Tailwind CSS**: Custom branding colors (Primary: Blue `#1E40AF`, Secondary: Dark Navy `#0F172A`, Accent: Teal `#0D9488`), responsive flexbox & grid cards, smooth transitions, mobile hamburger navigation.
- **JavaScript / TypeScript**: DOM events, live instant search & multi-filtering, dynamic client rendering, transparent matching algorithm, local storage fallback.
- **Backend & Database**: Node.js + Express REST API (`backend/server.js`) backed by SQLite3 database (`retrace.db`) seeded with rich demo items, users, location stats, and claims.

---

## 🛠️ How to Run the Project

### Start Backend API Server
```bash
cd backend
npm install
npm start
```
*Runs Express REST API on `http://localhost:5000` with SQLite database.*

### Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Runs Vite dev server on `http://localhost:5173`.*
