# Local Startup Instructions

To run the application locally on your machine, please follow these steps:

### 1. Start the Backend Server
Open a terminal and run:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate.ps1
# Set required environment variables
$env:API_KEY = "suriya0306"
$env:MOCK_AI = "true"  # Recommended for fast testing
python app.py
```
*The backend will be available at: http://localhost:5000*

### 2. Start the Frontend Server
Open a **second** terminal and run:
```powershell
cd frontend
npm install
npm run dev
```
*The frontend will be available at: http://localhost:5173*

---

### 🌐 Local Links
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 🔑 Local Credentials
- **API Key:** `suriya0306`
