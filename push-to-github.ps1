#!/usr/bin/env powershell
# GitHub Push Automation Script
# Handles Git initialization, configuration, and push to GitHub

param(
    [string]$GitHubURL = "",
    [string]$UserName = "",
    [string]$Email = ""
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host "" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "   $Text" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "[ERROR] $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    Write-Host "[INFO] $Text" -ForegroundColor Yellow
}

# Main script
Write-Header "GitHub Push Automation"

# Check Git installation
Write-Host "Checking Git installation..."
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Git found: $gitVersion"
    }
}
catch {
    Write-Error-Custom "Git not found. Please install from: https://git-scm.com/download/win"
    exit 1
}

# Get GitHub URL if not provided
if (-not $GitHubURL) {
    Write-Host ""
    Write-Info "Enter your GitHub repository URL"
    Write-Host "Example: https://github.com/username/call-analytics-app.git"
    $GitHubURL = Read-Host "GitHub URL"
}

if (-not $GitHubURL) {
    Write-Error-Custom "GitHub URL is required"
    exit 1
}

# Get username if not provided
if (-not $UserName) {
    Write-Host ""
    Write-Info "Enter your GitHub username for Git configuration"
    $UserName = Read-Host "GitHub username"
}

# Get email if not provided
if (-not $Email) {
    Write-Host ""
    Write-Info "Enter your GitHub email for Git configuration"
    $Email = Read-Host "GitHub email"
}

# Configure Git
Write-Header "Configuring Git"
git config --global user.name $UserName
Write-Success "Git username set: $UserName"

git config --global user.email $Email
Write-Success "Git email set: $Email"

# Initialize repository
Write-Header "Initializing Git Repository"
if (Test-Path ".git") {
    Write-Info "Git repository already initialized"
}
else {
    git init
    Write-Success "Git repository initialized"
}

# Add all files
Write-Header "Staging Files"
git add .
Write-Success "All files staged for commit"

# Show what will be committed
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short | ForEach-Object {
    Write-Host "  $_"
}

# Create commit
Write-Header "Creating Initial Commit"
$commitMessage = @"
Initial commit: Production-ready Call Analytics platform

- Frontend: React/TypeScript with Vite
- Backend: Flask REST API with Celery support
- Integration: Direct audio analysis via /api/call-analytics
- Features: Transcript, keywords, SOP validation, analytics
- Deployment: Ready for Render (backend) and Vercel (frontend)
- Security: API key authentication, CORS configured
- Documentation: Complete deployment guides included
"@

git commit -m $commitMessage
Write-Success "Initial commit created"

# Set main branch
Write-Header "Setting Up Remote Repository"
git branch -M main
Write-Success "Branch renamed to: main"

# Add remote
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $existingRemote -eq $GitHubURL) {
    Write-Info "Remote already configured correctly"
}
else {
    if ($LASTEXITCODE -eq 0) {
        git remote remove origin
        Write-Info "Removed existing remote"
    }
    git remote add origin $GitHubURL
    Write-Success "Remote repository added: $GitHubURL"
}

# Verify remote
Write-Host ""
git remote -v | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Cyan
}

# Push to GitHub
Write-Header "Pushing to GitHub"
Write-Info "This may prompt for your GitHub credentials"
Write-Info "Use your username and personal access token (PAT) as password"
Write-Info "Generate PAT at: github.com/settings/tokens"

try {
    git push -u origin main
    Write-Success "Successfully pushed to GitHub!"
}
catch {
    Write-Error-Custom "Push failed. Check your credentials and try again."
    Write-Host ""
    Write-Info "If you don't have a personal access token:"
    Write-Info "1. Go to: github.com/settings/tokens"
    Write-Info "2. Click 'Generate new token'"
    Write-Info "3. Select 'repo' scope"
    Write-Info "4. Copy token and use as password"
    exit 1
}

# Verify push
Write-Header "Verification"
Write-Host "Repository URL: $GitHubURL" -ForegroundColor Cyan
Write-Host "Branch: main" -ForegroundColor Cyan
Write-Host "Status: " -NoNewline
Write-Host "Successfully published!" -ForegroundColor Green

Write-Header "Next Steps"
Write-Host "1. [OK] Code pushed to GitHub"
Write-Host "2. [->] Deploy to Render (backend)"
Write-Host "3. [->] Deploy to Vercel (frontend)"
Write-Host "4. [->] Set environment variables"
Write-Host "5. [->] Test live application"
Write-Host ""
Write-Success "Ready for cloud deployment!"
Write-Host ""
Write-Info "For detailed guides, see:"
Write-Host "  - RENDER_DEPLOYMENT.md"
Write-Host "  - PRODUCTION_DEPLOY.md"
Write-Host "  - FINAL_CHECKLIST.md"
Write-Host ""
