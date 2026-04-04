"""
WSGI entry point for Gunicorn on Render
"""
import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_path)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app from backend/app.py
from backend.app import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
