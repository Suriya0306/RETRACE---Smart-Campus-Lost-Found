"""
WSGI entry point for Gunicorn
This allows Gunicorn to properly import and run the Flask app
"""
import sys
import os

# Add backend to path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the app
from backend.app import app

if __name__ == "__main__":
    app.run()
