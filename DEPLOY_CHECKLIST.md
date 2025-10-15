# Deployment Checklist

## ✅ Pre-Deploy
- [ ] Have GitHub account ready
- [ ] Have Vercel account ready (vercel.com)
- [ ] Get Anthropic API key from console.anthropic.com

## ✅ Files Included
- [x] All 3 round components
- [x] Main App.jsx router
- [x] 3 API endpoints (serverless functions)
- [x] Complete Vite/React setup
- [x] Tailwind CSS config
- [x] Vercel deployment config

## ✅ Deploy Steps

### 1. Push to GitHub
```bash
# If starting fresh:
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repo:
git remote add origin https://github.com/YOUR_USERNAME/ai-prompting-game.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Vercel auto-detects Vite → click Deploy
5. Wait 1-2 minutes

### 3. Add Environment Variable
1. In Vercel dashboard → Settings → Environment Variables
2. Add new variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from Anthropic
   - Environments: ✓ Production ✓ Preview ✓ Development
3. Redeploy (Deployments tab → click ... → Redeploy)

### 4. Test It
1. Open your deployed URL
2. Try Round 1 (should work immediately)
3. Try Round 2 (should work immediately)
4. Try Round 3 (tests API integration)

## 🔧 Troubleshooting

**API calls failing?**
- Check environment variable is set in Vercel
- Check API key is valid at console.anthropic.com
- Look at Vercel function logs (Deployments → Function Logs)

**UI looks broken?**
- Tailwind not compiling? Check build logs
- Missing lucide-react icons? npm install might have failed

**Deploy failing?**
- Check package.json is present
- Check all files are committed to git
- Check Vercel build logs for errors

## 📊 Usage Stats to Monitor

After launch, monitor:
- Anthropic API usage (console.anthropic.com)
- Vercel function invocations
- Average completion time per round
- Drop-off rates (localStorage leaderboard size vs unique visitors)

## 🎯 Success Metrics

Good signs:
- Round 1 completion rate > 80%
- Round 2 completion rate > 60%  
- Round 3 attempts > 40%
- Average Round 3 score improving over time
- Low support tickets / error reports

## 💰 Cost Expectations

Claude Sonnet 4 pricing:
- Input: $3 / million tokens
- Output: $15 / million tokens

Per Round 3 playthrough (~2300 tokens total): ~$0.05

Expected for 100 users/day:
- Daily: $5
- Monthly: $150
- Annual: $1,800

Vercel is free for hobby projects, or $20/month for Pro.

## 🚀 Optional Enhancements

Consider adding:
- [ ] User authentication (Clerk, Auth0)
- [ ] Database for leaderboard (Vercel Postgres, Supabase)
- [ ] Admin dashboard to view submissions
- [ ] Email notifications for completed rounds
- [ ] Slack integration to post high scores
- [ ] Custom branding/theming per firm
- [ ] A/B testing different scenarios
- [ ] Analytics (PostHog, Mixpanel)

## 📞 Support Resources

If stuck:
- Vercel docs: vercel.com/docs
- Anthropic docs: docs.anthropic.com
- React docs: react.dev
- Vite docs: vitejs.dev

The game is designed to work out of the box - if something's not working, it's likely:
1. Missing environment variable
2. API key issue
3. Build error (check logs)
