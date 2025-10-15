#!/bin/bash

echo "🚀 AI Prompting Game - Quick Deploy"
echo "===================================="
echo ""

# Check if we're in a git repo
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: AI Prompting Game"
fi

echo ""
echo "✅ Files ready!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin YOUR_REPO_URL"
echo "   git push -u origin main"
echo ""
echo "2. Deploy on Vercel:"
echo "   → Go to https://vercel.com/new"
echo "   → Import your GitHub repo"
echo "   → Add environment variable: ANTHROPIC_API_KEY"
echo "   → Deploy!"
echo ""
echo "3. Get your Anthropic API key:"
echo "   → https://console.anthropic.com/"
echo ""
echo "That's it! 🎉"
