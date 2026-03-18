# CycleAI - Quick Start Guide (5 Minutes)

## For MacBook Air M3 Users

### Already Have Node.js Installed?
If you already have Node.js (v18+), skip to Step 2.

### Step 1: Install Node.js (2 min)
```bash
# Install via Homebrew
brew install node

# Verify
node --version
npm --version
```

### Step 2: Download & Open Project (1 min)
```bash
# Download this project
cd ~/Desktop

# Navigate into project (or open VS Code)
code cycle-ai-app
```

### Step 3: Install Dependencies (1 min)
Open VS Code terminal (Ctrl+`) and run:
```bash
npm install
```

### Step 4: Start App (1 min)
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Demo Account (Test Immediately)

Go to login page and use:
- **Email:** demo@example.com
- **Password:** password123

---

## What You Can Do Right Now

1. **View Dashboard** - See cycle predictions and insights
2. **Log Period** - Add a new cycle entry
3. **View Analytics** - See charts and trends
4. **Manage Profile** - Update your settings

### ✨ AI Features (NEW!)
Enable AI-powered features for advanced insights:

**What's Available:**
- **Chatbot Assistant** 💬 - Ask questions about your cycle and health
- **Personalized Recommendations** 💡 - Get wellness tips based on your history
- **Data Summarization** 📊 - Analyze trends and download reports

**To Enable AI Features:**
1. Get free Groq API key from [console.groq.com](https://console.groq.com)
2. Add to `.env.local`: `NEXT_PUBLIC_GROQ_API_KEY=your_key_here`
3. Restart dev server (`npm run dev`)
4. See AI features on Dashboard!

📚 **Full Setup Guide**: See [GROQ_AI_SETUP.md](./GROQ_AI_SETUP.md)

---

## File Structure (Just Know These)

```
- app/          ← All pages (dashboard, login, profile, etc.)
- components/   ← Reusable components
- lib/          ← Logic (auth, predictions)
- public/       ← Images & assets
```

---

## Common Commands

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm start          # Run production server
npm run lint       # Check code quality
```

---

## Deploying to Vercel (Free)

### Option 1: Upload to Vercel Dashboard
1. Go to vercel.com
2. Upload this project
3. Done! App is live in 2 minutes

### Option 2: Deploy via GitHub
```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# Then import on Vercel dashboard
```

---

## Features Included

✅ User authentication (register/login)
✅ Cycle tracking and predictions
✅ Dashboard with insights
✅ Analytics with charts
✅ PDF report download
✅ Profile management
✅ Responsive mobile design
✅ Production-ready code

---

## Need Help?

See `SETUP_AND_DEPLOYMENT_GUIDE.md` for detailed information.

---

**That's it! You're ready to go.** 🎉
