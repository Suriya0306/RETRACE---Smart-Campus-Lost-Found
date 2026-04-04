#!/bin/bash
# GitHub Push Automation Script (Linux/Mac)
# Handles Git initialization, configuration, and push to GitHub

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${CYAN}════════════════════════════════════${NC}"
    echo -e "${CYAN}   $1${NC}"
    echo -e "${CYAN}════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Main script
print_header "GitHub Push Automation"

# Check Git installation
echo "Checking Git installation..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git found: $GIT_VERSION"
else
    print_error "Git not found. Install with: brew install git (Mac) or apt-get install git (Linux)"
    exit 1
fi

# Get GitHub URL if not provided
if [ -z "$1" ]; then
    echo ""
    print_info "Enter your GitHub repository URL"
    echo "Example: https://github.com/username/call-analytics-app.git"
    read -p "GitHub URL: " GITHUB_URL
else
    GITHUB_URL=$1
fi

if [ -z "$GITHUB_URL" ]; then
    print_error "GitHub URL is required"
    exit 1
fi

# Get username
echo ""
print_info "Enter your GitHub username for Git configuration"
read -p "GitHub username: " USERNAME

# Get email
echo ""
print_info "Enter your GitHub email for Git configuration"
read -p "GitHub email: " EMAIL

# Configure Git
print_header "Configuring Git"
git config --global user.name "$USERNAME"
print_success "Git username set: $USERNAME"

git config --global user.email "$EMAIL"
print_success "Git email set: $EMAIL"

# Initialize repository
print_header "Initializing Git Repository"
if [ -d ".git" ]; then
    print_info "Git repository already initialized"
else
    git init
    print_success "Git repository initialized"
fi

# Add all files
print_header "Staging Files"
git add .
print_success "All files staged for commit"

# Show what will be committed
echo -e "${CYAN}Files to be committed:${NC}"
git status --short | sed 's/^/  /'

# Create commit
print_header "Creating Initial Commit"
git commit -m "Initial commit: Production-ready Call Analytics platform

- Frontend: React/TypeScript with Vite
- Backend: Flask REST API with Celery support
- Integration: Direct audio analysis via /api/call-analytics
- Features: Transcript, keywords, SOP validation, analytics
- Deployment: Ready for Render (backend) and Vercel (frontend)
- Security: API key authentication, CORS configured
- Documentation: Complete deployment guides included"

print_success "Initial commit created"

# Set main branch
print_header "Setting Up Remote Repository"
git branch -M main
print_success "Branch renamed to: main"

# Add remote
if git remote get-url origin &> /dev/null; then
    EXISTING_REMOTE=$(git remote get-url origin)
    if [ "$EXISTING_REMOTE" = "$GITHUB_URL" ]; then
        print_info "Remote already configured correctly"
    else
        git remote remove origin
        print_info "Removed existing remote"
        git remote add origin "$GITHUB_URL"
        print_success "Remote repository updated: $GITHUB_URL"
    fi
else
    git remote add origin "$GITHUB_URL"
    print_success "Remote repository added: $GITHUB_URL"
fi

# Verify remote
echo ""
echo -e "${CYAN}Remote configuration:${NC}"
git remote -v | sed 's/^/  /'

# Push to GitHub
print_header "Pushing to GitHub"
print_info "This may prompt for your GitHub credentials"
print_info "Use your username and personal access token (PAT) as password"
print_info "Generate PAT at: github.com/settings/tokens"
echo ""

if git push -u origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Push failed. Check your credentials and try again."
    echo ""
    print_info "If you don't have a personal access token:"
    echo "1. Go to: github.com/settings/tokens"
    echo "2. Click 'Generate new token'"
    echo "3. Select 'repo' scope"
    echo "4. Copy token and use as password"
    exit 1
fi

# Verify push
print_header "Verification"
echo -e "${CYAN}Repository URL:${NC} $GITHUB_URL"
echo -e "${CYAN}Branch:${NC} main"
echo -e "${CYAN}Status:${NC} ${GREEN}Successfully published!${NC}"

print_header "Next Steps"
echo "1. ✓ Code pushed to GitHub"
echo "2. → Deploy to Render (backend)"
echo "3. → Deploy to Vercel (frontend)"
echo "4. → Set environment variables"
echo "5. → Test live application"
echo ""
print_success "Ready for cloud deployment! 🚀"
echo ""
print_info "For detailed guides, see:"
echo "  - RENDER_DEPLOYMENT.md"
echo "  - PRODUCTION_DEPLOY.md"
echo "  - FINAL_CHECKLIST.md"
echo ""
