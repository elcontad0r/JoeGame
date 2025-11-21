# AI Prompting Game - Deployment Guide

A 3-round interactive training game teaching execs how to write better AI prompts for lobbying/public affairs work.

## Quick Deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account (free)
- Anthropic API key

### 2. Setup Steps

1. **Create a new repo and push this code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Add Environment Variable**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = `your-anthropic-api-key`
   - Make sure it's set for Production, Preview, and Development

4. **Deploy**
   - Click Deploy
   - Wait 1-2 minutes
   - Your app will be live!

### 3. Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create an account if needed
3. Go to API Keys section
4. Create a new key
5. Copy it and paste into Vercel environment variables

## Project Structure

```
/
├── api/                    # Vercel serverless functions
│   ├── generate-scenario.js   # Creates random scenarios
│   ├── generate-content.js    # Generates content from user prompts
│   └── evaluate-prompt.js     # Evaluates prompt quality
├── App.jsx                 # Main router
├── round1-improved.jsx     # Round 1: Comparison
├── round2-improved.jsx     # Round 2: Guided building
├── round3-updated.jsx      # Round 3: Freestyle (updated for API)
├── index.html
├── main.jsx
├── package.json
└── vercel.json
```

## How It Works

### Round 1: See the Difference
- Shows bad vs good prompts side-by-side
- Static content, no API calls
- Takes ~5 minutes

### Round 2: Build Your Prompt
- Guided prompt building with choices
- Static evaluation based on selections
- Takes ~5 minutes

### Round 3: Freestyle Challenge
- Random scenario generation via API
- User writes their own prompt
- Real-time Claude generation and evaluation
- Leaderboard stored in localStorage
- Takes ~5+ minutes

## API Endpoints

All endpoints are in `/api/` directory and deployed as Vercel serverless functions:

- `POST /api/generate-scenario` - Creates a random crisis scenario
- `POST /api/generate-content` - Generates content from user's prompt
- `POST /api/evaluate-prompt` - Evaluates prompt quality (0-100)

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:5173
```

For local API testing with Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

Set in Vercel dashboard under Settings → Environment Variables

## Cost Estimate

Using Claude Sonnet 4:
- ~500 tokens per scenario generation
- ~1000 tokens per content generation
- ~800 tokens per evaluation

Average cost per complete Round 3 playthrough: ~$0.05

For 100 users/day: ~$5/day = ~$150/month

## Customization

### Change sectors/scenarios
Edit the prompt in `api/generate-scenario.js`

### Adjust scoring rubric
Edit the evaluation prompt in `api/evaluate-prompt.js`

### Modify UI/branding
All components use Tailwind classes, easy to customize colors

## Troubleshooting

**API calls fail in production:**
- Check environment variable is set in Vercel
- Verify API key is valid in Anthropic console
- Check Vercel function logs

**Leaderboard not persisting:**
- Uses localStorage, which is per-browser
- For real persistence, add a database (Vercel Postgres, Supabase, etc.)

**Slow response times:**
- Claude API calls can take 2-5 seconds
- This is normal and expected
- Loading states are built in

## Next Steps

Optional enhancements:
- [ ] Add user authentication
- [ ] Store leaderboard in database
- [ ] Add admin panel to view all submissions
- [ ] Export results to CSV
- [ ] Add more round types
- [ ] Customize scenarios per firm

## Support

Issues? Check:
1. Vercel deployment logs
2. Browser console for errors
3. Anthropic API status page
# JoeGame

## Applying a patch (for new contributors)
If someone shares a patch file (for example `fix.patch`), you can apply it to this repository with the following steps:

1. Save the patch file into the repo root (the same folder that contains `package.json`).
2. Run `git apply fix.patch` to apply the changes.
3. Run `git status` to confirm the expected files changed. If something looks wrong, you can undo with `git apply -R fix.patch`.
4. Install dependencies if needed (`npm install`) and run a quick check (`npm run build`) to ensure the patch works.
5. Commit the changes once you are satisfied.

If the patch does not apply cleanly, it likely means your branch is out of date. Run `git pull` to get the latest changes, then try applying the patch again.

## Committing your changes (Git basics)
When you're ready to save your work to the repo:

1. **Check what changed**
   ```bash
   git status
   ```

2. **Stage the files you want to include** (replace `FILE` with actual paths, or use `.` for everything)
   ```bash
   git add FILE
   # or
   git add .
   ```

3. **Commit with a descriptive message**
   ```bash
   git commit -m "Describe what you changed"
   ```

4. **Push if you're using a remote** (skip this if you don't have one set up yet)
   ```bash
   git push
   ```

Tip: If Git complains about your name/email, configure them once with:
```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

## Committing changes without the command line (GitHub web UI)
If you prefer not to use terminal commands, you can still commit updates entirely in GitHub:

1. **Open the file to edit in GitHub**
   - Navigate to the repository on GitHub.
   - Click the file you want to change, then click the pencil icon (Edit this file).

2. **Make your edits in the browser**
   - Edit the text directly in the GitHub editor.
   - Scroll down to the "Commit changes" form.

3. **Describe your change and create the commit**
   - Enter a short commit message (e.g., "Generalize round 1 examples").
   - Optionally add a longer description in the text area below.
   - Choose "Commit directly to the <branch> branch" or create a new branch if you prefer.
   - Click **Commit changes**.

4. **Uploading new files**
   - From the repository root, click **Add file → Upload files**.
   - Drag/drop or select files from your computer.
   - Add a commit message and click **Commit changes**.

5. **If you need to revert a commit**
   - Go to the **Commits** tab.
   - Click the commit you want to undo, then click **Revert** and confirm. This creates a new commit that undoes the changes.

This approach lets you keep working without a local terminal while still creating proper git history in the repo.
