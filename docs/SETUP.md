# 🚀 Complete Setup Guide - AgentForge-XT

## ⚡ Quick Setup (5 Minutes)

### Step 1: Set Up Supabase Database

1. **Go to [Supabase](https://supabase.com)** and create a new project
2. **Copy your credentials** from Project Settings → API
3. **Run the database schema**:
   - Go to SQL Editor in Supabase
   - Copy and paste the content from `supabase/schema.sql`
   - Click "Run"

### Step 2: Update Environment Variables

Edit your `.env.local` file:

```env
# Supabase (REQUIRED - Get from Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Firebase (Already configured - you're good!)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA1YZd8J-wmPdovAwASAUtwdpVm9LYh8a4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agentforge-f6121.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agentforge-f6121
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agentforge-f6121.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=481655783952
NEXT_PUBLIC_FIREBASE_APP_ID=1:481655783952:web:767dadf6bd9ce1d3200095
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VRY5VQFKQJ

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start n8n (Optional but Recommended)

```bash
# Start n8n automation engine
docker-compose up -d

# Check if it's running
docker ps

# Access n8n at http://localhost:5678
# Default credentials: admin / password
```

### Step 4: Test Everything

```bash
# Your app is already running on http://localhost:3000
# 1. Sign up with email
# 2. Go to Dashboard
# 3. Create a new workflow
# 4. Test the workflow editor
```

---

## 🔧 What's Already Working

✅ **Frontend** - Next.js app running on port 3000
✅ **Firebase Auth** - Sign up/Sign in working
✅ **UI Components** - All pages designed
✅ **Workflow Editor** - Visual editor ready

## ❌ What Needs Setup

### 1. **Supabase Connection** (5 minutes)
- **Status**: Schema ready, just need to run it
- **Action**: Follow Step 1 above
- **Why**: To save workflows and user data

### 2. **n8n Engine** (Optional - 2 minutes)
- **Status**: Docker config ready
- **Action**: Run `docker-compose up -d`
- **Why**: For background automation (can skip for now)

---

## 📋 Detailed Backend Setup

### Option A: Quick Start (Recommended)

**Just use Supabase - no extra backend needed!**

1. Create Supabase project
2. Run the schema
3. Update `.env.local`
4. Restart your app: `npm run dev`

That's it! Your workflows will auto-save to Supabase.

### Option B: Full Production Setup

If you want the complete experience with n8n:

1. **Install Docker Desktop** (if not installed)
   - Download from https://www.docker.com/products/docker-desktop

2. **Start n8n**
   ```bash
   docker-compose up -d
   ```

3. **Configure n8n**
   - Go to http://localhost:5678
   - Set up admin account
   - Create your first workflow in n8n

4. **Connect to your app**
   - Workflows created in your app can trigger n8n
   - n8n runs in the background 24/7

---

## 🎯 What Each Service Does

| Service | Purpose | Required? | Setup Time |
|---------|---------|-----------|------------|
| **Next.js** | Your main app | ✅ Yes | Already running |
| **Firebase** | User authentication | ✅ Yes | Already configured |
| **Supabase** | Database for workflows | ✅ Yes | 5 minutes |
| **n8n** | Background automation | ⚠️ Optional | 2 minutes |

---

## 🔍 Testing Checklist

### ✅ Frontend Tests
- [ ] Can access http://localhost:3000
- [ ] Can sign up with email
- [ ] Can sign in
- [ ] Dashboard loads
- [ ] Can create new workflow
- [ ] Workflow editor opens
- [ ] Can drag and drop nodes
- [ ] Can connect nodes

### ✅ Backend Tests (After Supabase setup)
- [ ] Workflows save to database
- [ ] Dashboard shows saved workflows
- [ ] Can edit existing workflows
- [ ] Can delete workflows
- [ ] User data persists after logout

### ✅ n8n Tests (If using n8n)
- [ ] n8n accessible at http://localhost:5678
- [ ] Can create workflows in n8n
- [ ] Workflows execute in background

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
**Fix**: 
1. Check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
2. Make sure you ran the schema in Supabase SQL Editor
3. Restart your app: `Ctrl+C` then `npm run dev`

### Issue: "Docker not found"
**Fix**: 
1. Install Docker Desktop from https://docker.com
2. Start Docker Desktop
3. Run `docker-compose up -d` again

### Issue: "Workflows not saving"
**Fix**:
1. Open browser console (F12)
2. Check for errors
3. Verify Supabase credentials
4. Check if schema was run correctly

### Issue: "n8n not starting"
**Fix**:
1. Make sure Docker is running
2. Check if port 5678 is free: `netstat -ano | findstr :5678`
3. Try: `docker-compose down` then `docker-compose up -d`

---

## 🎓 Next Steps After Setup

### 1. **Create Your First Workflow**
   - Go to Dashboard → New Workflow
   - Add a "Webhook" trigger
   - Add an "AI Agent" node
   - Add a "Slack" action
   - Connect them
   - Click "Execute"

### 2. **Enable Background Execution**
   - Toggle "Active" in workflow editor
   - Workflow will run automatically when triggered

### 3. **Add More Integrations**
   - Explore all node types
   - Connect to your APIs
   - Build complex automations

### 4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel (frontend)
   - Keep n8n on a server (backend)

---

## 📞 Need Help?

1. **Check the logs**: Browser console (F12) and terminal
2. **Read the docs**: See `README.md` and `ENHANCEMENTS.md`
3. **Common issues**: See Troubleshooting section above

---

## 🎉 You're All Set!

Once you complete the Supabase setup (Step 1-2), everything will be **100% functional**!

**Minimum to get started**: Just Supabase (5 minutes)
**Full experience**: Supabase + n8n (7 minutes)

Happy automating! 🚀
