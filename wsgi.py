"""
WSGI entry point for Gunicorn on Render
"""
import sys
import os

# Get the directory where this file is located
project_root = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(project_root, 'backend')

# Add both to path so imports work
sys.path.insert(0, backend_dir)
sys.path.insert(0, project_root)

# Now import Flask app from backend/app.py
# This works because backend is in sys.path
try:
    from app import app
except ImportError as e:
    print(f"Error importing app: {e}")
    # Fallback - try with explicit path
    import importlib.util
    spec = importlib.util.spec_from_file_location("app", os.path.join(backend_dir, "app.py"))
    app_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(app_module)
    app = app_module.app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
