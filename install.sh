#!/bin/bash

# CycleAI Installation Script for macOS
# This script automates the setup process for the CycleAI application

echo "=========================================="
echo "  CycleAI - Installation Script"
echo "  For macOS (M1/M2/M3)"
echo "=========================================="
echo ""

# Check if Node.js is installed
echo "Checking for Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing via Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    # Install Node.js
    brew install node
else
    echo "✓ Node.js found: $(node --version)"
fi

echo ""
echo "Checking for Git installation..."
if ! command -v git &> /dev/null; then
    echo "Git not found. Installing via Homebrew..."
    brew install git
else
    echo "✓ Git found: $(git --version)"
fi

echo ""
echo "Installing npm dependencies..."
echo "This may take a few minutes on first run..."
npm install

if [ $? -ne 0 ]; then
    echo "Error installing dependencies. Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "=========================================="
echo "  Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "3. Try the demo account:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""
echo "=========================================="
echo ""
echo "For more information, see:"
echo "  - QUICK_START.md (fast setup)"
echo "  - SETUP_AND_DEPLOYMENT_GUIDE.md (detailed guide)"
echo "  - PROJECT_SUMMARY.md (project overview)"
echo ""
