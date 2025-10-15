# 🚀 5-Minute Deploy Guide

## You need:
1. Anthropic API key (get at console.anthropic.com)
2. GitHub account
3. Vercel account (free at vercel.com)

## Steps:

### 1. Extract & Push
```bash
# Extract the tarball
tar -xzf ai-prompting-game.tar.gz
cd ai-prompting-game

# Push to GitHub (create new repo first on GitHub)
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### 2. Deploy on Vercel
- Go to vercel.com/new
- Click "Import" next to your repo
- Click "Deploy" (Vercel auto-detects everything)

### 3. Add API Key
- In Vercel: Settings → Environment Variables
- Add `ANTHROPIC_API_KEY` = your-api-key
- Redeploy (Deployments → ... → Redeploy)

## Done! 🎉

Your game is now live. Share the Vercel URL with your team.

## What you get:
- **Round 1**: Comparison teaching (5 min)
- **Round 2**: Guided prompt building (5 min)  
- **Round 3**: Freestyle + leaderboard (5+ min)

## Cost:
- Vercel: Free
- Anthropic: ~$0.05 per Round 3 completion
- 100 users/day ≈ $150/month

## Need help?
Check README.md and DEPLOY_CHECKLIST.md for details.

Everything's configured and ready to go - just deploy it!
