# CycleAI - Complete Development & Deployment Guide

## Overview
CycleAI is an AI-powered menstrual cycle prediction system built with Next.js 15, React 19, TypeScript, and Tailwind CSS. This guide will help you set up, develop, and deploy the application on macOS (M3 MacBook Air).

---

## TABLE OF CONTENTS
1. [macOS Prerequisites & Installation](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running the Application](#running)
4. [File Structure](#file-structure)
5. [Features Overview](#features)
6. [Testing the Application](#testing)
7. [Building for Production](#building)
8. [Deploying to Vercel](#deploying)
9. [Troubleshooting](#troubleshooting)

---

## PREREQUISITES <a name="prerequisites"></a>

### Step 1: Install Homebrew
Homebrew is the package manager for macOS.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Add Homebrew to PATH:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

Verify installation:
```bash
brew --version
```

### Step 2: Install Node.js & npm
```bash
brew install node
```

Verify installation:
```bash
node --version
npm --version
```

### Step 3: Install Git
```bash
brew install git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Install Visual Studio Code
Download from [https://code.visualstudio.com/download](https://code.visualstudio.com/download) and select **Apple Silicon (M3 compatible)**.

Or use Homebrew:
```bash
brew install visual-studio-code
```

### Step 5: VS Code Extensions (Recommended)
Open VS Code and install these extensions from the Extensions Marketplace (Cmd+Shift+X):

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **Prettier - Code formatter** - esbenp.prettier-vscode
4. **ESLint** - dbaeumer.vscode-eslint
5. **TypeScript Vue Plugin** - Vue.vscode-typescript-vue-plugin

### Step 6: Install pnpm (Optional, Recommended)
```bash
npm install -g pnpm
```

---

## PROJECT SETUP <a name="project-setup"></a>

### Option A: Clone from GitHub (If using Git)
```bash
git clone <your-repo-url>
cd cycle-ai-app
npm install
```

### Option B: Create New Project
Navigate to your desired directory and create the project:

```bash
cd ~/Desktop
npx create-next-app@latest cycle-ai-app --typescript --tailwind --eslint --app
```

Select these options when prompted:
- TypeScript: ✅ Yes
- Tailwind CSS: ✅ Yes
- ESLint: ✅ Yes
- App Router: ✅ Yes
- Src directory: ❌ No
- Default import alias: ✅ Yes

### Step 3: Install Required Dependencies

Navigate to your project:
```bash
cd cycle-ai-app
```

Install all dependencies:
```bash
npm install react-hook-form zod axios lucide-react jspdf recharts date-fns
```

### Step 4: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Add all required components:
```bash
npx shadcn@latest add button card input label select checkbox slider dialog toast dropdown-menu switch alert
```

---

## RUNNING THE APPLICATION <a name="running"></a>

### Start Development Server

Open terminal in VS Code (Ctrl+`) and run:

```bash
npm run dev
```

Your application will be available at: **http://localhost:3000**

### Using Demo Account

You can immediately test the app with the demo account:
- **Email:** demo@example.com
- **Password:** password123

This account is pre-configured with sample cycle data.

### Navigate the App

1. **Home Page** (http://localhost:3000) - Landing page with features overview
2. **About** (http://localhost:3000/about) - Project information and tech stack
3. **Register** (http://localhost:3000/register) - Create new account
4. **Login** (http://localhost:3000/login) - Sign in with email/password
5. **Dashboard** (http://localhost:3000/dashboard) - View cycle predictions and insights
6. **Cycle Entry** (http://localhost:3000/cycle-entry) - Log period and symptoms
7. **Analytics** (http://localhost:3000/analytics) - View charts and trends
8. **Profile** (http://localhost:3000/profile) - Manage account settings

---

## FILE STRUCTURE <a name="file-structure"></a>

```
cycle-ai-app/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles & Tailwind
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (protected)
│   ├── cycle-entry/
│   │   └── page.tsx            # Cycle entry form (protected)
│   ├── analytics/
│   │   └── page.tsx            # Analytics & charts (protected)
│   └── profile/
│       └── page.tsx            # Profile settings (protected)
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── ProtectedRoute.tsx      # Protected route wrapper
│
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── cyclePredictions.ts     # Prediction engine
│   └── utils.ts                # Utility functions
│
├── hooks/
│   └── useCyclePredictions.ts  # Custom hook for predictions
│
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
└── next.config.mjs             # Next.js config
```

---

## FEATURES OVERVIEW <a name="features"></a>

### 1. Authentication System
- User registration with validation
- Email/password login with JWT tokens
- Session management (7-day expiration)
- Protected routes for authenticated users
- Demo account for testing

### 2. Cycle Tracking
- Log period start/end dates
- Track flow intensity (light/medium/heavy)
- Record mood and 8+ symptoms
- Add personal notes
- Automatic cycle statistics calculation

### 3. AI Predictions
- Current cycle day counter
- Next period prediction
- Ovulation date calculation
- Fertile window identification
- Cycle regularity detection
- Alerts for irregular patterns

### 4. Analytics Dashboard
- Line charts for cycle flow trends
- Bar charts for symptom frequency
- Pie charts for flow distribution
- Cycle calendar visualization
- PDF report download
- Data export functionality

### 5. Profile Management
- Edit personal information
- Update cycle preferences
- Notification settings
- Data privacy controls
- Account deletion option
- Data backup/download

---

## TESTING THE APPLICATION <a name="testing"></a>

### Manual Testing Checklist

#### Authentication
- [ ] Register new account with valid data
- [ ] Attempt registration with existing email (should show error)
- [ ] Login with valid credentials
- [ ] Attempt login with wrong password (should show error)
- [ ] Use demo account to test without registration
- [ ] Logout functionality works correctly

#### Dashboard
- [ ] View current cycle day calculation
- [ ] Check predicted next period date
- [ ] Verify ovulation date
- [ ] See fertile window dates
- [ ] Observe irregularity alerts

#### Cycle Entry
- [ ] Log period with all fields
- [ ] Select multiple symptoms
- [ ] Choose flow intensity
- [ ] Add optional notes
- [ ] Submit and verify data saved
- [ ] View entry on dashboard

#### Analytics
- [ ] View trend line chart
- [ ] Check symptom frequency bar chart
- [ ] See flow distribution pie chart
- [ ] Browse cycle calendar
- [ ] Download PDF report
- [ ] Verify all charts update with new entries

#### Profile
- [ ] Edit user information
- [ ] Update cycle preferences
- [ ] Toggle notification settings
- [ ] View data management section
- [ ] Delete individual entries
- [ ] Clear all data (with confirmation)

### Browser Testing
Test across browsers:
- Chrome/Chromium
- Firefox
- Safari
- Mobile browsers (responsive design)

---

## BUILDING FOR PRODUCTION <a name="building"></a>

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

The app will run on http://localhost:3000 in production mode.

### Build Optimizations Included
- Code splitting
- Image optimization
- CSS minification
- JavaScript minification
- Static generation where possible
- Dynamic imports for performance

---

## DEPLOYING TO VERCEL <a name="deploying"></a>

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CycleAI app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cycle-ai-app.git
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your GitHub account and deploy.

#### Option B: Via Vercel Web Dashboard
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `cycle-ai-app` repository
5. Click "Import"
6. Configure project settings
7. Click "Deploy"

### Step 3: Environment Variables
The app uses localStorage for data, so no backend environment variables are required. For future MongoDB integration, add:

```
NEXT_PUBLIC_API_URL=your_api_url
```

### Step 4: Access Your Deployed App
After deployment completes, your app will be available at:
- `https://your-project-name.vercel.app`

---

## TROUBLESHOOTING <a name="troubleshooting"></a>

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Issue: Tailwind CSS not applying
**Solution:**
```bash
# Rebuild Tailwind
npm run dev
```

### Issue: localStorage not persisting data
**Solution:**
- Ensure not in private/incognito mode
- Clear browser cache (Cmd+Shift+Delete)
- Check if localStorage is enabled in browser settings

### Issue: Charts not displaying
**Solution:**
- Ensure Recharts is installed: `npm install recharts`
- Clear browser cache
- Check browser console for errors

### Issue: Form validation not working
**Solution:**
- Verify react-hook-form and zod are installed
- Check console for validation errors
- Ensure form field names match schema

### Issue: Demo account not working
**Solution:**
- Check that `initializeDemoData()` runs on home page load
- Verify localStorage contains demo user
- Try clearing browser storage and reloading

---

## PERFORMANCE OPTIMIZATION TIPS

### Development
- Use VS Code's built-in debugger
- Monitor bundle size: `npm run build && npm ls`
- Use React DevTools extension
- Profile with Lighthouse (in Chrome DevTools)

### Production
- Enable gzip compression
- Use CDN for static assets
- Implement image optimization
- Lazy load components
- Monitor with Vercel Analytics

---

## SECURITY BEST PRACTICES

### Currently Implemented
- Password hashing simulation (SHA-256)
- JWT token management
- Protected routes
- Input validation (Zod)
- XSS protection via React
- CSRF prevention (HTTP-only cookies for future)

### For Production Migration
1. Move authentication to backend
2. Use proper bcrypt hashing
3. Implement HTTPS/SSL
4. Add rate limiting
5. Use secure session cookies
6. Implement proper CORS policies
7. Add data encryption at rest

---

## NEXT STEPS & FUTURE ENHANCEMENTS

### Immediate Improvements
- [ ] Add dark mode toggle
- [ ] Implement push notifications
- [ ] Add print functionality for reports
- [ ] Create mobile app with React Native

### Backend Integration
- [ ] Set up MongoDB/PostgreSQL
- [ ] Move authentication to server
- [ ] Implement real API endpoints
- [ ] Add email verification
- [ ] Implement password reset

### Advanced Features
- [ ] Machine learning predictions
- [ ] Integration with fitness trackers
- [ ] Doctor consultation booking
- [ ] Community forums
- [ ] Medication tracking
- [ ] Fertility tracking

---

## SUPPORT & RESOURCES

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

### Community
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
- [Stack Overflow - Next.js Tag](https://stackoverflow.com/questions/tagged/next.js)

### Issues & Questions
If you encounter problems:
1. Check the Troubleshooting section above
2. Search existing GitHub issues
3. Review the console for error messages
4. Check the build logs in Vercel

---

## CONCLUSION

You now have a fully functional CycleAI application ready for development and deployment! The app demonstrates best practices in:
- Modern React development
- Full-stack application architecture
- User authentication and authorization
- Data visualization and analytics
- Responsive design
- Production deployment

Start by running `npm run dev` and exploring all the features. Happy coding!

---

**Last Updated:** March 4, 2026
**Version:** 1.0.0
