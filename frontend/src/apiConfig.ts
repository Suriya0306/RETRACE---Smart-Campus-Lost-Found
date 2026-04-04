// Centralized API Configuration

// In development, the Vite server (port 5173) connects to the Flask server (port 5000).
// In production, when the app is served directly from Flask, it uses a relative URL ('').
export const API = import.meta.env.DEV 
  ? 'https://call-analytics-app-yg07.onrender.com' 
  : (import.meta.env.VITE_API_URL ?? '');

// API version and health check
export const API_HEALTH = `${API}/api/health`;
