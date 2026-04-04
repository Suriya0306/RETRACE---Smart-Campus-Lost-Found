#!/bin/bash
# Production Deployment Setup Script

echo "🚀 Call Analytics - Production Deployment"
echo "=========================================="

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

echo "✓ Python3 found: $(python3 --version)"
echo "✓ Node.js found: $(node --version)"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
API_KEY=sk_track3_987654321
WHISPER_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379
EOF
    echo "⚠️  Update .env with your API keys"
else
    echo "✓ .env already exists"
fi

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "✓ Backend dependencies installed"
else
    echo "✓ Virtual environment exists"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo "Building frontend..."
npm run build
echo "✓ Frontend built: $(ls -lh dist/ | tail -1)"

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your actual API keys"
echo "2. Run backend: cd backend && source venv/bin/activate && python app.py"
echo "3. Deploy to Render and Vercel"
echo ""
echo "Documentation: See INTEGRATION_GUIDE.md"
