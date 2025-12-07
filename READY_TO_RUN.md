# 🚀 AgentForge-XT - Ready to Run!

## ✅ All API Keys Configured

Your API keys have been added:
- ✅ Groq API (gsk_bI4bE...)
- ✅ Supabase (https://nwcnfbopgabsdvaqxvkj.supabase.co)
- ✅ NextAuth.js (replaces Clerk - no domain needed!)

## 🔄 Changes Made

### Replaced Clerk with NextAuth.js
- ✅ No domain required for production
- ✅ Works perfectly in development and production
- ✅ Supports email/password + social logins (GitHub, Google)
- ✅ All authentication pages updated

### Configured Your API Keys
- ✅ Backend `.env` - Groq and Supabase configured
- ✅ Frontend `.env.local` - Supabase and NextAuth configured

## 🏃 Quick Start (2 Steps!)

### Step 1: Generate NextAuth Secret
```bash
# Run this command to generate a secret key:
openssl rand -base64 32
```

Copy the output and add it to `frontend/.env.local`:
```env
NEXTAUTH_SECRET=paste_generated_secret_here
```

### Step 2: Run the Application

**Option A: Run Both Servers Together**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Authentication Features

### Email/Password Login
- Sign up with email and password
- Secure authentication
- No external dependencies

### Social Logins (Optional)
To enable GitHub/Google login:

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create New OAuth App
3. Homepage URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env.local`

**Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

## 📱 What You Can Do Now

1. **Sign Up** at http://localhost:3000/sign-up
2. **Sign In** at http://localhost:3000/sign-in
3. **Dashboard** - View stats and quick actions
4. **Builder** - Create agent workflows visually
5. **Templates** - Clone pre-built agent teams
6. **Executions** - Monitor workflow runs

## 🎯 Test the Application

### 1. Create Your First Workflow
```
1. Go to http://localhost:3000/sign-up
2. Create an account (any email/password)
3. Navigate to /builder
4. Click "Researcher" to add an agent
5. Click "Writer" to add another agent
6. Connect them by dragging between nodes
7. Click "Save Workflow"
```

### 2. Try a Template
```
1. Go to /templates
2. Click "Clone Template" on "Blog Writer Team"
3. Go to /builder to see your cloned workflow
4. Click "Run Workflow" to execute
```

### 3. Monitor Executions
```
1. Go to /executions
2. View execution history
3. See stats and token usage
```

## 🔧 Current Configuration

### Backend (.env)
```env
GROQ_API_KEY=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 ✅
SUPABASE_URL=https://nwcnfbopgabsdvaqxvkj.supabase.co ✅
SUPABASE_KEY=sb_publishable_p08m5csfj-FlstFXPDC_PA_No4BwM3o ✅
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://nwcnfbopgabsdvaqxvkj.supabase.co ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_p08m5csfj-FlstFXPDC_PA_No4BwM3o ✅
NEXTAUTH_SECRET=⚠️ GENERATE THIS (see Step 1 above)
```

## ⚠️ Important: Set Supabase Password

You need to set your Supabase database password in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.nwcnfbopgabsdvaqxvkj:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Get your password from:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → Database → Connection String
4. Copy the password and replace `[YOUR-PASSWORD]`

## 🐛 Troubleshooting

### "NEXTAUTH_SECRET is not set"
Run: `openssl rand -base64 32` and add to `.env.local`

### "Database connection failed"
Add your Supabase password to `DATABASE_URL` in `backend/.env`

### "Module not found: next-auth"
```bash
cd frontend
npm install next-auth@beta
```

### Backend won't start
```bash
cd backend
pip install -r requirements.txt
```

## 🎉 You're All Set!

Once you:
1. Generate and add `NEXTAUTH_SECRET`
2. Add your Supabase password to `DATABASE_URL`
3. Run `npm run dev`

You'll have a fully functional AI agent platform! 🚀

## 📚 Next Steps

- Create your first agent workflow
- Try the pre-built templates
- Monitor executions in real-time
- Deploy to production (Vercel + Railway)

**Enjoy building with AgentForge-XT!** ✨
