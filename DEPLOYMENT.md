# 🚀 Deployment Guide

## 1. Database Setup (Supabase)

1.  Go to your **Supabase Dashboard** -> **SQL Editor**.
2.  Paste the contents of `supabase/schema.sql` and run it.
    *   This creates the required tables (`profiles`, `workflows`, `executions`, `templates`) and security policies.
3.  Go to **Settings** -> **Database** and copy your **Connection String**.
    *   You'll need this for the backend deployment.

## 2. Backend Deployment (Railway or Render)

*Since the backend runs Python (FastAPI + CrewAI), it's best hosted on a platform that supports long-running processes.*

### Option A: Railway (Recommended)

1.  Sign up at [railway.app](https://railway.app).
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your repository.
4.  Add these **Environment Variables** in Railway:
    *   `GROQ_API_KEY`: `your_key`
    *   `SUPABASE_URL`: `your_url`
    *   `SUPABASE_KEY`: `your_key`
    *   `DATABASE_URL`: `your_connection_string` (Replace `[YOUR-PASSWORD]` with actual password)
    *   `ENVIRONMENT`: `production`
5.  Set the **Root Directory** to `backend`.
6.  Set the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option B: Render

1.  Sign up at [render.com](https://render.com).
2.  New **Web Service**.
3.  Connect your repo.
4.  **Root Directory**: `backend`
5.  **Build Command**: `pip install -r requirements.txt`
6.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
7.  Add the same Environment Variables as above.

## 3. Frontend Deployment (Vercel)

1.  Sign up at [vercel.com](https://vercel.com).
2.  **Add New** -> **Project**.
3.  Import your repository.
4.  **Framework Preset**: Next.js
5.  **Root Directory**: `frontend`
6.  Add **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: `your_url`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your_key`
    *   `NEXTAUTH_SECRET`: `your_secret` (Generate with `openssl rand -base64 32`)
    *   `NEXTAUTH_URL`: `https://your-vercel-domain.vercel.app`
    *   `NEXT_PUBLIC_API_URL`: `https://your-backend-url.railway.app` (The URL from Step 2)
7.  Deploy!

## 4. Final Updates

After deploying both:

1.  Update `NEXT_PUBLIC_API_URL` in Vercel to point to your live Backend URL.
2.  Update `CORS_ORIGINS` in Railway/Render to include your live Vercel frontend URL (e.g., `https://agentforge-xt.vercel.app`).

## 5. You're Live! 🚀

Visit your Vercel URL to see your production app.
