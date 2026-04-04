"""
WSGI entry point for Gunicorn
This allows Gunicorn to properly import and run the Flask app
"""
import sys
import os

# Add current directory and backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

# Now import the app
try:
    # Try importing from backend module
    from app import app
except ImportError:
    # Fallback - try absolute import
    import importlib.util
    spec = importlib.util.spec_from_file_location("app", os.path.join(os.path.dirname(__file__), "backend", "app.py"))
    app_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(app_module)
    app = app_module.app

if __name__ == "__main__":
    app.run()
